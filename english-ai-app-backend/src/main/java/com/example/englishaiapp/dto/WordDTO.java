package com.example.englishaiapp.dto;

import com.example.englishaiapp.domain.Word;
import lombok.Data;

@Data
public class WordDTO {
    private Long id;
    private String word;
    private String phonetic;
    private String meaning;
    private String wordClass;
    private String exampleSentence;
    private String exampleTranslation;
    private String phrase;
    private String distortion;
    private String tip;

    public WordDTO(Word word) {
        this.id = word.getId();
        this.word = word.getWord();
        this.phonetic = word.getPhonetic();
        this.meaning = word.getMeaning();
        this.wordClass = word.getWordClass();
        this.exampleSentence = word.getExampleSentence();
        this.exampleTranslation = word.getExampleTranslation();
        this.phrase = word.getPhrase();
        this.distortion = word.getDistortion();
        this.tip = word.getTip();
    }
}
