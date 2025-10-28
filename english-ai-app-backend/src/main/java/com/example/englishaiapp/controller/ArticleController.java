package com.example.englishaiapp.controller;

import com.example.englishaiapp.dto.ArticleResponse;
import com.example.englishaiapp.dto.WordProgressRequest;
import com.example.englishaiapp.security.CustomUserDetails;
import com.example.englishaiapp.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("/next")
    public ResponseEntity<?> getNextArticle(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "generic") String type) {
        
        try {
            Long userId = userDetails.getId();

            ArticleResponse response = articleService.getNextArticle(userId, type);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            
            switch (e.getMessage()) {
                case "NO_GENERIC_ARTICLES":
                    error.put("message", "没有可用的通用文章，请联系管理员");
                    error.put("code", "NO_GENERIC_ARTICLES");
                    return ResponseEntity.status(500).body(error);
                    
                case "ARTICLES_NOT_UNLOCKED":
                    error.put("message", "定制文章未解锁，请学习满16个单词后再试");
                    error.put("code", "ARTICLES_NOT_UNLOCKED");
                    return ResponseEntity.status(403).body(error);
                    
                case "NO_WORDS_AVAILABLE":
                    error.put("message", "你背的单词已经学完啦！去刷单词或继续文章题目，或者返回主界面");
                    error.put("code", "NO_WORDS_AVAILABLE");
                    return ResponseEntity.badRequest().body(error);
                    
                default:
                    error.put("message", "文章生成失败: " + e.getMessage());
                    error.put("code", "GENERATION_FAILED");
                    return ResponseEntity.status(500).body(error);
            }
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeArticle(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Long> request) {
        
        try {
            Long userId = userDetails.getId();
            Long articleId = request.get("articleId");
            
            if (articleId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "缺少 articleId 参数");
                error.put("code", "INVALID_REQUEST");
                return ResponseEntity.badRequest().body(error);
            }

            articleService.completeArticle(userId, articleId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "文章已完成，队列已补充");
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("code", "COMPLETE_FAILED");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/progress")
    public ResponseEntity<?> updateWordProgress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody WordProgressRequest request) {
        
        try {
            Long userId = userDetails.getId();
            
            articleService.updateWordProgress(
                userId, 
                request.getArticleId(), 
                request.getWord(), 
                request.getState()
            );
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "单词进度已更新");
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("code", "UPDATE_FAILED");
            return ResponseEntity.status(500).body(error);
        }
    }
}
