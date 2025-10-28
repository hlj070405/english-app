package com.example.englishaiapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
public class ArticleResponse {
    private Long articleId; // 文章ID（仅定制模式有值）
    private String title;
    private String content;
    private List<WordItem> wordBank;

    @Data
    @NoArgsConstructor
    public static class WordItem {
        private Long id;
        private String word;
        private String meaning;
        private Integer masteryScore;
        private String state; // "unused", "correct", "wrong"

        public WordItem(Long id, String word, String meaning, Integer masteryScore) {
            this.id = id;
            this.word = word;
            this.meaning = meaning;
            this.masteryScore = masteryScore;
            this.state = "unused"; // 默认未使用
        }
    }
}
