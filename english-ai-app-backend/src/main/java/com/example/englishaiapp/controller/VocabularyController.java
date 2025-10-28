package com.example.englishaiapp.controller;

import com.example.englishaiapp.security.CustomUserDetails;
import com.example.englishaiapp.service.VocabularyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {

    @Autowired
    private VocabularyService vocabularyService;

    @GetMapping("/my-words")
    public ResponseEntity<?> getMyVocabulary(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        if (userDetails == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "未登录或会话已过期，请重新登录。");
            return ResponseEntity.status(401).body(error);
        }

        try {
            Map<String, Object> result = vocabularyService.getUserVocabulary(
                    userDetails.getUserId(), page, size);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取词库失败: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getVocabularyStats(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "未登录或会话已过期，请重新登录。");
            return ResponseEntity.status(401).body(error);
        }

        try {
            Map<String, Object> stats = vocabularyService.getVocabularyStats(userDetails.getUserId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取统计信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
