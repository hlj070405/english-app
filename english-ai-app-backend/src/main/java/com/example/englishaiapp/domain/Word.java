package com.example.englishaiapp.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "words")
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;

    private String phonetic;

    @Column(columnDefinition = "TEXT")
    private String meaning;

    private String wordClass;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer difficulty = 1;

    private String category;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer frequency = 0;

    @Column(columnDefinition = "TEXT")
    private String exampleSentence;

    @Column(columnDefinition = "TEXT")
    private String exampleTranslation;

    @Column(columnDefinition = "TEXT")
    private String distortion; // 词形变化

    @Column(columnDefinition = "TEXT")
    private String phrase; // 相关词组

    @Column(columnDefinition = "TEXT")
    private String tip; // 助记提示

    @CreationTimestamp
    private LocalDateTime createdAt;
}
