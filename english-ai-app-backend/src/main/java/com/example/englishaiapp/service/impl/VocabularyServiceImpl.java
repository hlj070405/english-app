package com.example.englishaiapp.service.impl;

import com.example.englishaiapp.domain.UserWordMastery;
import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.repository.UserWordMasteryRepository;
import com.example.englishaiapp.repository.WordRepository;
import com.example.englishaiapp.service.VocabularyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VocabularyServiceImpl implements VocabularyService {

    @Autowired
    private UserWordMasteryRepository masteryRepository;

    @Autowired
    private WordRepository wordRepository;

    @Override
    public Map<String, Object> getUserVocabulary(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("masteryScore").ascending());
        Page<UserWordMastery> masteryPage = masteryRepository.findByUserId(userId, pageable);

        List<Long> wordIds = masteryPage.getContent().stream()
                .map(UserWordMastery::getWordId)
                .collect(Collectors.toList());

        Map<Long, Word> wordMap = new HashMap<>();
        if (!wordIds.isEmpty()) {
            List<Word> words = wordRepository.findAllById(wordIds);
            wordMap = words.stream().collect(Collectors.toMap(Word::getId, w -> w));
        }

        List<Map<String, Object>> vocabularyList = new ArrayList<>();
        for (UserWordMastery mastery : masteryPage.getContent()) {
            Word word = wordMap.get(mastery.getWordId());
            if (word != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", word.getId());
                item.put("word", word.getWord());
                item.put("translation", word.getMeaning());
                item.put("phonetic", word.getPhonetic());
                item.put("definition", word.getMeaning());
                item.put("exampleSentence", word.getExampleSentence());
                item.put("masteryScore", mastery.getMasteryScore());
                item.put("correctCount", 0);
                item.put("incorrectCount", 0);
                item.put("lastLearnedAt", mastery.getLastLearnedAt());
                item.put("masteryLevel", calculateMasteryLevel(mastery.getMasteryScore()));
                vocabularyList.add(item);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("words", vocabularyList);
        result.put("currentPage", masteryPage.getNumber());
        result.put("totalPages", masteryPage.getTotalPages());
        result.put("totalWords", masteryPage.getTotalElements());
        result.put("pageSize", masteryPage.getSize());
        return result;
    }

    @Override
    public Map<String, Object> getVocabularyStats(Long userId) {
        List<UserWordMastery> allMastery = masteryRepository.findByUserId(userId);

        int totalWords = allMastery.size();
        int masteredWords = 0;
        int learningWords = 0;
        int weakWords = 0;

        for (UserWordMastery mastery : allMastery) {
            double score = mastery.getMasteryScore();
            if (score >= 3.0) {
                masteredWords++;
            } else if (score >= 1.0) {
                learningWords++;
            } else {
                weakWords++;
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalWords", totalWords);
        stats.put("masteredWords", masteredWords);
        stats.put("learningWords", learningWords);
        stats.put("weakWords", weakWords);
        return stats;
    }

    private String calculateMasteryLevel(double score) {
        if (score >= 3.0) return "已掌握";
        else if (score >= 1.5) return "学习中";
        else if (score >= 0.5) return "初识";
        else return "生词";
    }
}
