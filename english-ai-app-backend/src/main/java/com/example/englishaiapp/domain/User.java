package com.example.englishaiapp.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users") // 使用 "users" 因为 "user" 是 SQL 关键字
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nickname;

    private String avatar;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer coins = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer gems = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer streakDays = 0;

    private LocalDate lastCheckinDate;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer totalCheckinDays = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer totalWordsLearned = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer wordsMastered = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;
}
