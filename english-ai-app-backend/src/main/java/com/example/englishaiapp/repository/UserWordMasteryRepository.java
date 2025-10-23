package com.example.englishaiapp.repository;

import com.example.englishaiapp.domain.UserWordMastery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserWordMasteryRepository extends JpaRepository<UserWordMastery, Long> {

    Optional<UserWordMastery> findByUserIdAndWordId(Long userId, Long wordId);
}
