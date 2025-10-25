package com.example.englishaiapp.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "article_templates")
public class ArticleTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "word_bank_json", columnDefinition = "TEXT")
    private String wordBankJson;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'intermediate'")
    private String difficulty = "intermediate";

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'GENERIC'")
    private String type = "GENERIC";

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
