package com.example.englishaiapp.service;

import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DataImportService {

    @Autowired
    private WordRepository wordRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Regex to capture the values from the SQL INSERT statement
    private static final Pattern INSERT_PATTERN = Pattern.compile(
        "INSERT INTO `wine_cet4_word` VALUES \\((\\d+), '(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)'\\);"
    );

    @Transactional
    public void importWordsFromSqlFile(String filePath) throws IOException {
        // Clear existing data to prevent duplicates on re-run
        wordRepository.deleteAllInBatch();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("INSERT INTO `wine_cet4_word`")) {
                    parseAndSaveLine(line);
                }
            }
        }
    }

    private void parseAndSaveLine(String line) {
        Matcher matcher = INSERT_PATTERN.matcher(line);
        if (matcher.find()) {
            try {
                Word word = new Word();

                // Extract raw data from SQL
                // String originalId = matcher.group(1); // This ID is from the old table and not used.
                String cet4Word = matcher.group(2).replace("''", "'");
                String cet4Phonetic = matcher.group(3).replace("''", "'");
                String cet4Translate = matcher.group(4).replace("''", "'");
                String cet4Distortion = matcher.group(5).replace("''", "'");
                String cet4Phrase = matcher.group(6).replace("''", "'");
                String cet4Samples = matcher.group(7).replace("''", "'");

                // Apply parsing rules
                word.setWord(cet4Word);
                word.setPhonetic(parsePhonetic(cet4Phonetic));
                
                String[] translateParts = parseTranslate(cet4Translate);
                word.setWordClass(translateParts[0]);
                word.setMeaning(translateParts[1]);

                String[] sampleParts = parseSamples(cet4Samples);
                word.setExampleSentence(sampleParts[0]);
                word.setExampleTranslation(sampleParts[1]);

                word.setDistortion(cet4Distortion);
                word.setPhrase(parsePhraseToJson(cet4Phrase));
                word.setTip(cet4Distortion); // Use distortion as a tip
                word.setFrequency(0); // Default frequency

                wordRepository.save(word);
            } catch (Exception e) {
                System.err.println("Failed to parse or save line: " + line);
                e.printStackTrace();
            }
        }
    }

    private String parsePhonetic(String rawPhonetic) {
        if (rawPhonetic == null || rawPhonetic.isEmpty()) return "";
        String phonetic = "";
        // Prioritize British phonetic
        int startIndex = rawPhonetic.indexOf("英:[");
        if (startIndex != -1) {
            int endIndex = rawPhonetic.indexOf("]", startIndex);
            if (endIndex != -1) {
                phonetic = rawPhonetic.substring(startIndex + 2, endIndex + 1);
                return phonetic;
            }
        }
        // Fallback to American phonetic
        startIndex = rawPhonetic.indexOf("美:[");
        if (startIndex != -1) {
            int endIndex = rawPhonetic.indexOf("]", startIndex);
            if (endIndex != -1) {
                phonetic = rawPhonetic.substring(startIndex + 2, endIndex + 1);
                return phonetic;
            }
        }
        // Fallback to the first available phonetic
        startIndex = rawPhonetic.indexOf("[");
        if (startIndex != -1) {
            int endIndex = rawPhonetic.indexOf("]", startIndex);
            if (endIndex != -1) {
                phonetic = rawPhonetic.substring(startIndex, endIndex + 1);
                return phonetic;
            }
        }
        return phonetic;
    }

    private String[] parseTranslate(String rawTranslate) {
        String[] parts = {"", ""}; // 0: wordClass, 1: meaning
        if (rawTranslate == null || rawTranslate.isEmpty()) return parts;

        int dotIndex = rawTranslate.indexOf(".");
        if (dotIndex > 0 && dotIndex < 10) { // Assume word class is short (e.g., n., v., adj.)
            parts[0] = rawTranslate.substring(0, dotIndex + 1);
            parts[1] = rawTranslate.substring(dotIndex + 1).trim().replace("\\n", "; ");
        } else {
            parts[1] = rawTranslate.replace("\\n", "; ");
        }
        return parts;
    }

    private String[] parseSamples(String rawSamples) {
        String[] parts = {"", ""}; // 0: sentence, 1: translation
        if (rawSamples == null || rawSamples.isEmpty()) return parts;

        String[] lines = rawSamples.split("\\n");
        if (lines.length >= 2) {
            // First line is the sentence
            String sentence = lines[0].trim();
            if (sentence.startsWith("\"")) {
                sentence = sentence.substring(1);
            }
            if (sentence.endsWith("\"")) {
                sentence = sentence.substring(0, sentence.length() - 1);
            }
            parts[0] = sentence;

            // Second line is the translation
            parts[1] = lines[1].trim().replaceAll("^“|”$", "");
        }
        return parts;
    }

    private String parsePhraseToJson(String rawPhrase) {
        if (rawPhrase == null || rawPhrase.isEmpty()) {
            return "[]"; // Return empty JSON array
        }

        List<Map<String, String>> phrases = new ArrayList<>();
        // Split by the literal string "\n", so we need to escape the backslash twice.
        String[] lines = rawPhrase.split("\\\\n");

        // Iterate in pairs (phrase and its translation)
        for (int i = 0; i < lines.length - 1; i += 2) {
            String phrase = lines[i].trim();
            String translation = lines[i + 1].trim();

            if (!phrase.isEmpty() && !translation.isEmpty()) {
                Map<String, String> phraseMap = new LinkedHashMap<>();
                phraseMap.put("phrase", phrase);
                phraseMap.put("translation", translation);
                phrases.add(phraseMap);
            }
        }

        try {
            return objectMapper.writeValueAsString(phrases);
        } catch (JsonProcessingException e) {
            System.err.println("Failed to serialize phrase to JSON: " + rawPhrase);
            return "[]";
        }
    }
}
