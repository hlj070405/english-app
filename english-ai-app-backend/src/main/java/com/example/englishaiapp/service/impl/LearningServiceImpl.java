package com.example.englishaiapp.service.impl;

import com.example.englishaiapp.domain.User;
import com.example.englishaiapp.domain.UserWordMastery;
import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.repository.UserRepository;
import com.example.englishaiapp.repository.UserWordMasteryRepository;
import com.example.englishaiapp.repository.WordRepository;
import com.example.englishaiapp.service.ArticleService;
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

    @Autowired
    private ArticleService articleService;

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

        // 记录是否是首次学习
        boolean isFirstTime = (mastery.getLastLearnedAt() == null);

        // 2. 更新打分逻辑
        if (isFirstTime) {
            // 首次学习
            // 答对直接毕业（分数>=6），避免短期内重复
            mastery.setMasteryScore(isCorrect ? 6 : 0);
            
            // 更新用户的 totalWordsLearned
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setTotalWordsLearned(user.getTotalWordsLearned() + 1);
            userRepository.save(user);
        } else {
            // 再次学习
            if (isCorrect) {
                mastery.setMasteryScore(mastery.getMasteryScore() + 2);
            } else {
                // 答错扣分，让单词更容易被复习到
                mastery.setMasteryScore(Math.max(0, mastery.getMasteryScore() - 2));
            }
        }

        // 3. 更新时间
        mastery.setLastLearnedAt(LocalDateTime.now());

        // 4. 保存
        userWordMasteryRepository.save(mastery);

        // 5. 更新用户的 recentWordIds 队列
        updateRecentWords(userId, wordId);

        // 6. 检查是否达到解锁条件（16个单词）
        checkAndUnlockArticles(userId);

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
     * 更新用户的 recentWordIds（严格的FIFO队列，无重复，最多5个）
     */
    private void updateRecentWords(Long userId, Long wordId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found while updating recent words"));
        List<Long> recentIds = new ArrayList<>(parseRecentWordIds(user.getRecentWordIds()));

        // 1. 如果单词已存在，先移除，确保它会被移到队尾
        recentIds.remove(wordId);

        // 2. 将当前单词添加到队尾
        recentIds.add(wordId);

        // 3. 如果队列超长，从队首移除多余的元素，确保队列大小不超过5
        while (recentIds.size() > 5) {
            recentIds.remove(0); // 移除队首元素
        }

        // 4. 保存回数据库
        try {
            user.setRecentWordIds(objectMapper.writeValueAsString(recentIds));
            userRepository.save(user);
        } catch (Exception e) {
            // 在真实应用中，这里应该使用日志框架记录错误
            System.err.println("序列化或保存 recentWordIds 失败: " + e.getMessage());
        }
    }

    /**
     * 检查并解锁定制文章（学习满16个单词后）
     */
    private void checkAndUnlockArticles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 如果已经解锁，直接返回
        if (Boolean.TRUE.equals(user.getArticlesUnlocked())) {
            return;
        }

        // 检查是否达到解锁条件
        if (user.getTotalWordsLearned() >= 16) {
            user.setArticlesUnlocked(true);
            userRepository.save(user);

            // 立即生成2篇定制文章
            try {
                articleService.generateBatchForUser(userId, 2);
                System.out.println("用户 " + userId + " 已解锁定制文章，生成2篇文章");
            } catch (Exception e) {
                System.err.println("生成解锁文章失败: " + e.getMessage());
            }
        }
    }
}
