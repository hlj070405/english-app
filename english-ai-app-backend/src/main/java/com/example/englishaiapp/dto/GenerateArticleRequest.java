package com.example.englishaiapp.dto;

import lombok.Data;

@Data
public class GenerateArticleRequest {
    private String difficulty = "intermediate"; // beginner, intermediate, advanced
}
