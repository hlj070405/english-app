package com.example.englishaiapp.controller;

import com.example.englishaiapp.security.CustomUserDetails;
import com.example.englishaiapp.service.UserStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserStatsController {

    @Autowired
    private UserStatsService userStatsService;

    /**
     * 每日签到
     */
    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "未登录或会话已过期，请重新登录后再签到。");
            return ResponseEntity.status(401).body(error);
        }
        try {
            Map<String, Object> result = userStatsService.checkIn(userDetails.getUserId());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 获取用户统计信息（连续签到、能力值等）
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "未登录或会话已过期，请重新登录。");
            return ResponseEntity.status(401).body(error);
        }
        try {
            Map<String, Object> stats = userStatsService.getUserStats(userDetails.getUserId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取统计信息失败: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * 获取排行榜信息
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "未登录或会话已过期，请重新登录。");
            return ResponseEntity.status(401).body(error);
        }
        try {
            Map<String, Object> leaderboard = userStatsService.getLeaderboard(userDetails.getUserId());
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取排行榜失败: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
