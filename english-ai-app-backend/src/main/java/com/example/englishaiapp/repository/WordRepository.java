package com.example.englishaiapp.repository;

import com.example.englishaiapp.domain.Word;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {

    @Query("SELECT w FROM Word w WHERE w.id NOT IN (SELECT m.wordId FROM UserWordMastery m WHERE m.userId = :userId) AND w.id NOT IN :recentWordIds ORDER BY w.id ASC")
    List<Word> findNewWordsForUser(Long userId, List<Long> recentWordIds, Pageable pageable);
}
