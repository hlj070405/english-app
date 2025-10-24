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

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer learnCount = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer correctCount = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer wrongCount = 0;

    private LocalDateTime firstLearnedAt;

    private LocalDateTime lastReviewedAt;

    private LocalDateTime lastContactAt;

    private LocalDateTime nextReviewAt;

    @Column(columnDefinition = "BIGINT DEFAULT 0")
    private Long queuePosition = 0L;

    @Enumerated(EnumType.STRING)
    private WordLearningStatus status = WordLearningStatus.LEARNING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
