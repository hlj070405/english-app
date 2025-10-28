package com.example.englishaiapp.service;

import com.example.englishaiapp.dto.ArticleResponse;

public interface ArticleService {
    
    /**
     * 为用户生成定制化文章
     * @param userId 用户ID
     * @param difficulty 难度等级（beginner/intermediate/advanced）
     * @return 文章内容及单词库
     */
    ArticleResponse generateArticle(Long userId, String difficulty);

    /**
     * 获取下一篇文章（通用或定制）
     * @param userId 用户ID
     * @param type generic 或 custom
     * @return 文章内容
     */
    ArticleResponse getNextArticle(Long userId, String type);

    /**
     * 完成文章，触发队列补充
     * @param userId 用户ID
     * @param articleId 文章ID
     */
    void completeArticle(Long userId, Long articleId);

    /**
     * 为用户生成多篇定制文章（用于初次解锁）
     * @param userId 用户ID
     * @param count 数量
     */
    void generateBatchForUser(Long userId, int count);

    /**
     * 更新单词答题进度和掌握度
     * @param userId 用户ID
     * @param articleId 文章ID
     * @param word 单词
     * @param state 状态（correct/wrong）
     */
    void updateWordProgress(Long userId, Long articleId, String word, String state);
}
