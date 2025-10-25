package com.example.englishaiapp.controller;

import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.dto.WordDTO;
import com.example.englishaiapp.service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.englishaiapp.security.CustomUserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/learn")
public class LearningController {
    
    @Autowired
    private LearningService learningService;

    @GetMapping("/session")
    public ResponseEntity<List<WordDTO>> getLearningSession(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "20") int limit) {
        
        // 临时硬编码用户ID，用于测试
        Long userId = (userDetails != null) ? userDetails.getId() : 1L; 

        List<Word> words = learningService.getLearningSession(userId, limit);
        List<WordDTO> wordDTOs = words.stream().map(WordDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(wordDTOs);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitLearningResult(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody LearningResultRequest request) {

        // 临时硬编码用户ID，用于测试
        Long userId = (userDetails != null) ? userDetails.getId() : 1L;

        learningService.submitLearningResult(userId, request.getWordId(), request.isCorrect());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/strange-count")
    public ResponseEntity<Integer> getStrangeWordCount(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        // 临时硬编码用户ID，用于测试
        Long userId = (userDetails != null) ? userDetails.getId() : 1L;

        int count = learningService.getStrangeWordCount(userId);
        return ResponseEntity.ok(count);
    }

    // DTO for submit request
    static class LearningResultRequest {
        private Long wordId;
        private boolean isCorrect;

        public Long getWordId() { return wordId; }
        public void setWordId(Long wordId) { this.wordId = wordId; }
        public boolean isCorrect() { return isCorrect; }
        public void setCorrect(boolean correct) { isCorrect = correct; }
    }
}
