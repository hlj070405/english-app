package com.example.englishaiapp.controller;

import com.example.englishaiapp.dto.ChatRequest;
import com.example.englishaiapp.security.CustomUserDetails;
import com.example.englishaiapp.service.QwenClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    @Autowired
    private QwenClient qwenClient;

    /**
     * AI 聊天接口 - 简单的问答助手
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ChatRequest request) {
        
        try {
            // 构建系统提示词
            String systemPrompt = "你是一个专业的英语学习助手。用户会向你提问关于英语学习的问题，" +
                    "包括单词用法、语法、句型、翻译等。请用简洁、友好的中文回答，" +
                    "回答要准确、实用，适合英语学习者。" +
                    "重要：回答尽量简洁，最好50字以内，最多不超过200字。直接给出核心要点，不要冗余的客套话。";

            // 调用千问 API
            String reply = qwenClient.chat(systemPrompt, request.getMessage());

            Map<String, String> response = new HashMap<>();
            response.put("reply", reply);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "AI 回复失败: " + e.getMessage());
            error.put("code", "CHAT_FAILED");
            return ResponseEntity.status(500).body(error);
        }
    }
}
