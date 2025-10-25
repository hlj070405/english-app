package com.example.englishaiapp.repository;

import com.example.englishaiapp.domain.UserWordMastery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWordMasteryRepository extends JpaRepository<UserWordMastery, Long> {

    Optional<UserWordMastery> findByUserIdAndWordId(Long userId, Long wordId);

    // 查询需要复习的单词（分数 < 6，且不在最近5个中）
    @Query("SELECT m FROM UserWordMastery m WHERE m.userId = :userId AND m.masteryScore < 6 AND m.wordId NOT IN :recentWordIds ORDER BY m.masteryScore ASC, m.lastLearnedAt ASC")
    List<UserWordMastery> findReviewWords(Long userId, List<Long> recentWordIds, Pageable pageable);

    // 统计陈生单词数量（分数 < 6）
    long countByUserIdAndMasteryScoreLessThan(Long userId, Integer masteryScore);

    // 获取掌握度最低的前8个单词（用于生成文章）
    @Query("SELECT m FROM UserWordMastery m WHERE m.userId = :userId ORDER BY m.masteryScore ASC, m.lastLearnedAt ASC")
    List<UserWordMastery> findTop8ByUserIdOrderByMasteryScore(Long userId, Pageable pageable);
}
