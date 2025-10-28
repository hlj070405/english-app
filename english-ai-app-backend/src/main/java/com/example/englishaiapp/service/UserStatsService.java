package com.example.englishaiapp.service;

import java.util.Map;

public interface UserStatsService {
    
    /**
     * 每日签到
     */
    Map<String, Object> checkIn(Long userId);
    
    /**
     * 获取用户统计信息
     */
    Map<String, Object> getUserStats(Long userId);
    
    /**
     * 获取排行榜信息
     */
    Map<String, Object> getLeaderboard(Long userId);
}
