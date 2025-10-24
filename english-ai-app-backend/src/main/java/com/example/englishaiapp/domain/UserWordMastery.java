package com.example.englishaiapp.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_word_mastery", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "word_id"})
})
public class UserWordMastery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "word_id", nullable = false)
    private Long wordId;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer masteryScore = 0;

    private LocalDateTime lastLearnedAt;

    private LocalDateTime lastSeenAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 构造函数
    public UserWordMastery() {}

    public UserWordMastery(Long userId, Long wordId, Integer masteryScore) {
        this.userId = userId;
        this.wordId = wordId;
        this.masteryScore = masteryScore;
    }
}
