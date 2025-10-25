package com.example.englishaiapp.repository;

import com.example.englishaiapp.domain.UserArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserArticleRepository extends JpaRepository<UserArticle, Long> {

    // 查询用户的 READY 状态文章
    List<UserArticle> findByUserIdAndStatusOrderByCreatedAtAsc(Long userId, String status);

    // 统计用户的 READY 文章数量
    long countByUserIdAndStatus(Long userId, String status);

    // 查询用户最早的一篇 READY 文章
    Optional<UserArticle> findFirstByUserIdAndStatusOrderByCreatedAtAsc(Long userId, String status);
}
