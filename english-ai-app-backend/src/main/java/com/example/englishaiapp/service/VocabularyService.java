package com.example.englishaiapp.service;

import java.util.Map;

public interface VocabularyService {
    Map<String, Object> getUserVocabulary(Long userId, int page, int size);
    Map<String, Object> getVocabularyStats(Long userId);
}
