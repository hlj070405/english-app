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

    @Query("SELECT m FROM UserWordMastery m WHERE m.userId = :userId AND m.status = 'LEARNING' AND m.queuePosition >= :learningIndex ORDER BY m.queuePosition ASC")
    List<UserWordMastery> findReviewWords(Long userId, Long learningIndex, Pageable pageable);
}
