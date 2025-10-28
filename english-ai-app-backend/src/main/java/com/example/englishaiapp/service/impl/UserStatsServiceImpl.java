package com.example.englishaiapp.service.impl;

import com.example.englishaiapp.domain.User;
import com.example.englishaiapp.repository.UserRepository;
import com.example.englishaiapp.service.UserStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserStatsServiceImpl implements UserStatsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Map<String, Object> checkIn(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        LocalDate today = LocalDate.now();
        LocalDate lastCheckin = user.getLastCheckinDate();

        // 检查今天是否已经签到
        if (lastCheckin != null && lastCheckin.equals(today)) {
            throw new RuntimeException("今天已经签到过了");
        }

        // 计算连续签到天数
        int streakDays = user.getStreakDays();
        if (lastCheckin != null) {
            long daysBetween = ChronoUnit.DAYS.between(lastCheckin, today);
            if (daysBetween == 1) {
                // 连续签到
                streakDays++;
            } else if (daysBetween > 1) {
                // 中断了，重新开始
                streakDays = 1;
            }
        } else {
            // 首次签到
            streakDays = 1;
        }

        // 签到奖励
        int coinsReward = 10;
        int gemsReward = 0;
        
        // 连续签到额外奖励
        if (streakDays % 7 == 0) {
            gemsReward = 1; // 每连续7天奖励1个宝石
        }

        // 更新用户数据
        user.setLastCheckinDate(today);
        user.setStreakDays(streakDays);
        user.setTotalCheckinDays(user.getTotalCheckinDays() + 1);
        user.setCoins(user.getCoins() + coinsReward);
        user.setGems(user.getGems() + gemsReward);
        
        userRepository.save(user);

        // 返回签到结果
        Map<String, Object> result = new HashMap<>();
        result.put("streakDays", streakDays);
        result.put("totalCheckinDays", user.getTotalCheckinDays());
        result.put("coinsReward", coinsReward);
        result.put("gemsReward", gemsReward);
        result.put("coins", user.getCoins());
        result.put("gems", user.getGems());
        result.put("message", "签到成功！");

        return result;
    }

    @Override
    public Map<String, Object> getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        LocalDate today = LocalDate.now();
        boolean hasCheckedInToday = user.getLastCheckinDate() != null 
                && user.getLastCheckinDate().equals(today);

        Map<String, Object> stats = new HashMap<>();
        stats.put("streakDays", user.getStreakDays());
        stats.put("hasCheckedInToday", hasCheckedInToday);
        stats.put("coins", user.getCoins());
        stats.put("gems", user.getGems());
        stats.put("totalWordsLearned", user.getTotalWordsLearned());
        stats.put("wordsMastered", user.getWordsMastered());
        stats.put("totalCheckinDays", user.getTotalCheckinDays());

        return stats;
    }

    @Override
    public Map<String, Object> getLeaderboard(Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 计算用户经验值（可以根据多个维度计算）
        int userExp = calculateExp(currentUser);

        // 获取所有用户并计算排名
        List<User> allUsers = userRepository.findAll();
        
        // 计算当前用户的排名
        int rank = 1;
        int previousRank = 1; // 这里简化处理，实际应该从数据库或缓存中获取上次排名
        
        for (User user : allUsers) {
            int exp = calculateExp(user);
            if (exp > userExp) {
                rank++;
            }
        }

        // 计算排名变化
        int rankChange = previousRank - rank;

        Map<String, Object> leaderboard = new HashMap<>();
        leaderboard.put("rank", rank);
        leaderboard.put("rankChange", rankChange);
        leaderboard.put("exp", userExp);
        leaderboard.put("totalUsers", allUsers.size());

        return leaderboard;
    }

    /**
     * 计算用户经验值
     */
    private int calculateExp(User user) {
        // 经验值计算规则：
        // - 每学习一个单词：10经验
        // - 每掌握一个单词：20经验
        // - 每签到一天：5经验
        int exp = 0;
        exp += user.getTotalWordsLearned() * 10;
        exp += user.getWordsMastered() * 20;
        exp += user.getTotalCheckinDays() * 5;
        return exp;
    }
}
