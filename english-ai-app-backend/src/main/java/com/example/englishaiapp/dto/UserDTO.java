package com.example.englishaiapp.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String avatar;
    private Integer coins;
    private Integer gems;
    private Integer streakDays;
    private LocalDate lastCheckinDate;
    private Integer totalCheckinDays;
    private Integer totalWordsLearned;
    private Integer wordsMastered;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    // 可以添加一个静态工厂方法或构造函数来从 User 实体转换
    public UserDTO(com.example.englishaiapp.domain.User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.avatar = user.getAvatar();
        this.coins = user.getCoins();
        this.gems = user.getGems();
        this.streakDays = user.getStreakDays();
        this.lastCheckinDate = user.getLastCheckinDate();
        this.totalCheckinDays = user.getTotalCheckinDays();
        this.totalWordsLearned = user.getTotalWordsLearned();
        this.wordsMastered = user.getWordsMastered();
        this.createdAt = user.getCreatedAt();
        this.lastLoginAt = user.getLastLoginAt();
    }
}
