package com.example.englishaiapp.service;

import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.domain.UserWordMastery;

import java.util.List;

public interface LearningService {

    /**
     * 获取用户的学习任务（一组单词）
     * @param userId 用户ID
     * @param limit 获取的单词数量
     * @return 一组待学习/复习的单词
     */
    List<Word> getLearningSession(Long userId, int limit);

    /**
     * 提交用户的学习结果
     * @param userId 用户ID
     * @param wordId 单词ID
     * @param isCorrect 是否答对
     * @return 更新后的单词掌握度信息
     */
    UserWordMastery submitLearningResult(Long userId, Long wordId, boolean isCorrect);

    /**
     * 获取用户的陈生单词数量（分数 < 6）
     * @param userId 用户ID
     * @return 陈生单词数量
     */
    int getStrangeWordCount(Long userId);
}
