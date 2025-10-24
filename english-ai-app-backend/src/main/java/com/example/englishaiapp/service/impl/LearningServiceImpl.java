package com.example.englishaiapp.service.impl;

import com.example.englishaiapp.domain.User;
import com.example.englishaiapp.domain.UserWordMastery;
import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.domain.WordLearningStatus;
import com.example.englishaiapp.repository.UserRepository;
import com.example.englishaiapp.repository.UserWordMasteryRepository;
import com.example.englishaiapp.repository.WordRepository;
import com.example.englishaiapp.service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningServiceImpl implements LearningService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private UserWordMasteryRepository userWordMasteryRepository;

    @Override
    @Transactional
    public List<Word> getLearningSession(Long userId, int limit) {
        // 临时简化逻辑：直接返回前 N 个单词
        return wordRepository.findAll(PageRequest.of(0, limit)).getContent();
    }

    @Override
    @Transactional
    public UserWordMastery submitLearningResult(Long userId, Long wordId, boolean isCorrect) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserWordMastery mastery = userWordMasteryRepository.findByUserIdAndWordId(userId, wordId)
                .orElseThrow(() -> new RuntimeException("Word mastery record not found"));

        // 更新学习次数和对错次数
        mastery.setLearnCount(mastery.getLearnCount() + 1);
        mastery.setLastReviewedAt(LocalDateTime.now());

        int currentScore = mastery.getMasteryScore();
        int newScore;

        if (isCorrect) {
            mastery.setCorrectCount(mastery.getCorrectCount() + 1);
            newScore = currentScore + 2;
        } else {
            mastery.setWrongCount(mastery.getWrongCount() + 1);
            newScore = Math.max(0, currentScore - 2);
        }

        mastery.setMasteryScore(newScore);

        // 根据新分数决定下一个队列位置或状态
        if (newScore >= 12) {
            mastery.setStatus(WordLearningStatus.MASTERED);
            mastery.setQueuePosition(Long.MAX_VALUE); // 移出常规队列
        } else {
            mastery.setStatus(WordLearningStatus.LEARNING);
            long interval = getIntervalByMasteryScore(newScore);
            mastery.setQueuePosition(user.getLearningIndex() + interval);
        }

        // 更新用户的学习指针
        user.setLearningIndex(user.getLearningIndex() + 1);
        userRepository.save(user);

        return userWordMasteryRepository.save(mastery);
    }

    private long getIntervalByMasteryScore(int score) {
        if (score <= 3) {
            return 4; // 强化记忆区
        } else if (score <= 7) {
            return 20; // 巩固区
        } else { // 8 - 11
            return 50; // 熟练区
        }
    }
}
