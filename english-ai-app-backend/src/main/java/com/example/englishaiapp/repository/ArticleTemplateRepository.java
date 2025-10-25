package com.example.englishaiapp.repository;

import com.example.englishaiapp.domain.ArticleTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleTemplateRepository extends JpaRepository<ArticleTemplate, Long> {

    // 随机获取一篇通用文章
    @Query(value = "SELECT * FROM article_templates ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<ArticleTemplate> findRandomArticle();

    // 统计通用文章数量
    long count();
}
