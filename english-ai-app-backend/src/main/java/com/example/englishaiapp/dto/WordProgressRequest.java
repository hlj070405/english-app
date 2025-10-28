package com.example.englishaiapp.dto;

import lombok.Data;

@Data
public class WordProgressRequest {
    private Long articleId;
    private String word;
    private String state; // "correct" or "wrong"
}
