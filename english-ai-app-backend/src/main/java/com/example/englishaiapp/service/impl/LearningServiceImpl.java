package com.example.englishaiapp.service.impl;

import com.example.englishaiapp.domain.User;
import com.example.englishaiapp.domain.UserWordMastery;
import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.repository.UserRepository;
import com.example.englishaiapp.repository.UserWordMasteryRepository;
import com.example.englishaiapp.repository.WordRepository;
import com.example.englishaiapp.service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LearningServiceImpl implements LearningService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private UserWordMasteryRepository userWordMasteryRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public List<Word> getLearningSession(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 解析最近5个单词的ID
        List<Long> recentWordIds = parseRecentWordIds(user.getRecentWordIds());
        // 如果为空，传递一个包含-1的列表（不会匹配任何单词）
        if (recentWordIds.isEmpty()) {
            recentWordIds = List.of(-1L);
        }

        // 1. 查询需要复习的单词（分数 < 6，且不在最近5个中）
        List<UserWordMastery> reviewList = userWordMasteryRepository
                .findReviewWords(userId, recentWordIds, PageRequest.of(0, limit));

        List<Word> result = new ArrayList<>();
        for (UserWordMastery mastery : reviewList) {
            Word word = wordRepository.findById(mastery.getWordId()).orElse(null);
            if (word != null) {
                result.add(word);
                // 更新 lastSeenAt
                mastery.setLastSeenAt(LocalDateTime.now());
                userWordMasteryRepository.save(mastery);
            }
        }

        // 2. 如果不够，补充新词
        int newWordsNeeded = limit - result.size();
        if (newWordsNeeded > 0) {
            // 重新解析 recentWordIds（因为可能被修改为包含-1的列表）
            List<Long> recentIdsForNewWords = parseRecentWordIds(user.getRecentWordIds());
            if (recentIdsForNewWords.isEmpty()) {
                recentIdsForNewWords = List.of(-1L);
            }
            List<Word> newWords = wordRepository.findNewWordsForUser(
                    userId, recentIdsForNewWords, PageRequest.of(0, newWordsNeeded)
            );
            result.addAll(newWords);
        }

        return result;
    }

    @Override
    @Transactional
    public UserWordMastery submitLearningResult(Long userId, Long wordId, boolean isCorrect) {
        // 1. 查找或创建记录
        UserWordMastery mastery = userWordMasteryRepository
                .findByUserIdAndWordId(userId, wordId)
                .orElse(new UserWordMastery(userId, wordId, 0));

        // 2. 更新打分
        if (mastery.getLastLearnedAt() == null) {
            // 首次学习
            mastery.setMasteryScore(isCorrect ? 5 : 0);
        } else {
            // 再次学习
            if (isCorrect) {
                mastery.setMasteryScore(mastery.getMasteryScore() + 2);
            }
            // 答错保持不变
        }

        // 3. 更新时间
        mastery.setLastLearnedAt(LocalDateTime.now());

        // 4. 保存
        userWordMasteryRepository.save(mastery);

        // 5. 更新用户的 recentWordIds 队列
        updateRecentWords(userId, wordId);

        return mastery;
    }

    @Override
    public int getStrangeWordCount(Long userId) {
        return (int) userWordMasteryRepository
                .countByUserIdAndMasteryScoreLessThan(userId, 6);
    }

    /**
     * 解析 recentWordIds 字符串为 List<Long>
     */
    private List<Long> parseRecentWordIds(String recentWordIdsJson) {
        if (recentWordIdsJson == null || recentWordIdsJson.isEmpty() || recentWordIdsJson.equals("[]")) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(recentWordIdsJson, new TypeReference<List<Long>>() {});
        } catch (Exception e) {
            System.err.println("解析 recentWordIds 失败: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 更新用户的 recentWordIds（FIFO队列，最多5个）
     */
    private void updateRecentWords(Long userId, Long wordId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Long> recentIds = parseRecentWordIds(user.getRecentWordIds());

        // 移除旧的，添加新的
        recentIds.remove(wordId); // 如果已存在，先移除
        recentIds.add(wordId);    // 添加到末尾

        // 保持最多5个
        if (recentIds.size() > 5) {
            recentIds = recentIds.subList(recentIds.size() - 5, recentIds.size());
        }

        // 保存回数据库
        try {
            user.setRecentWordIds(objectMapper.writeValueAsString(recentIds));
            userRepository.save(user);
        } catch (Exception e) {
            System.err.println("保存 recentWordIds 失败: " + e.getMessage());
        }
    }
}
