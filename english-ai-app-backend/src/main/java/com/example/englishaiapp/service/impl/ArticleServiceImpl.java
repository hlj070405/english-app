package com.example.englishaiapp.service.impl;

import com.example.englishaiapp.domain.ArticleTemplate;
import com.example.englishaiapp.domain.User;
import com.example.englishaiapp.domain.UserArticle;
import com.example.englishaiapp.domain.UserWordMastery;
import com.example.englishaiapp.domain.Word;
import com.example.englishaiapp.dto.ArticleResponse;
import com.example.englishaiapp.repository.ArticleTemplateRepository;
import com.example.englishaiapp.repository.UserArticleRepository;
import com.example.englishaiapp.repository.UserRepository;
import com.example.englishaiapp.repository.UserWordMasteryRepository;
import com.example.englishaiapp.repository.WordRepository;
import com.example.englishaiapp.service.ArticleService;
import com.example.englishaiapp.service.QwenClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private UserWordMasteryRepository userWordMasteryRepository;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private QwenClient qwenClient;

    @Autowired
    private UserArticleRepository userArticleRepository;

    @Autowired
    private ArticleTemplateRepository articleTemplateRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public ArticleResponse generateArticle(Long userId, String difficulty) {
        // 1. 获取用户掌握度最低的8个单词
        List<UserWordMastery> masteryList = userWordMasteryRepository
                .findTop8ByUserIdOrderByMasteryScore(userId, PageRequest.of(0, 8));

        if (masteryList.isEmpty()) {
            throw new RuntimeException("NO_WORDS_AVAILABLE");
        }

        // 2. 查询单词详情
        List<Long> wordIds = masteryList.stream()
                .map(UserWordMastery::getWordId)
                .collect(Collectors.toList());
        
        List<Word> words = wordRepository.findAllById(wordIds);
        
        if (words.size() < 8) {
            throw new RuntimeException("NO_WORDS_AVAILABLE");
        }

        // 3. 构建单词信息（用于调用AI）
        List<Map<String, String>> wordInfoList = new ArrayList<>();
        Map<Long, UserWordMastery> masteryMap = masteryList.stream()
                .collect(Collectors.toMap(UserWordMastery::getWordId, m -> m));

        for (Word word : words) {
            Map<String, String> wordInfo = new HashMap<>();
            wordInfo.put("word", word.getWord());
            wordInfo.put("meaning", word.getMeaning());
            wordInfoList.add(wordInfo);
        }

        // 4. 调用千问生成文章
        Map<String, String> article = qwenClient.generateArticle(wordInfoList, difficulty);

        // 5. 构建单词库（打乱顺序）
        List<ArticleResponse.WordItem> wordBank = words.stream()
                .map(w -> {
                    UserWordMastery mastery = masteryMap.get(w.getId());
                    return new ArticleResponse.WordItem(
                            w.getId(),
                            w.getWord(),
                            w.getMeaning(),
                            mastery != null ? mastery.getMasteryScore() : 0
                    );
                })
                .collect(Collectors.toList());
        
        // 打乱顺序
        Collections.shuffle(wordBank);

        // 6. 构建响应
        ArticleResponse response = new ArticleResponse();
        response.setTitle(article.get("title"));
        response.setContent(article.get("content"));
        response.setWordBank(wordBank);

        return response;
    }

    @Override
    public ArticleResponse getNextArticle(Long userId, String type) {
        if ("generic".equalsIgnoreCase(type)) {
            // 通用模式：从模板库随机取一篇
            ArticleTemplate template = articleTemplateRepository.findRandomArticle()
                    .orElseThrow(() -> new RuntimeException("NO_GENERIC_ARTICLES"));
            
            return convertTemplateToResponse(template);
        } else if ("custom".equalsIgnoreCase(type)) {
            // 定制模式：检查用户是否解锁
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));
            
            if (!Boolean.TRUE.equals(user.getArticlesUnlocked())) {
                throw new RuntimeException("ARTICLES_NOT_UNLOCKED");
            }

            // 从队列取最早的一篇 READY 文章
            Optional<UserArticle> articleOpt = userArticleRepository
                    .findFirstByUserIdAndStatusOrderByCreatedAtAsc(userId, "READY");

            if (articleOpt.isEmpty()) {
                // 队列为空，立即生成一篇
                generateAndStoreCustomArticle(userId);
                articleOpt = userArticleRepository
                        .findFirstByUserIdAndStatusOrderByCreatedAtAsc(userId, "READY");
            }

            UserArticle article = articleOpt.orElseThrow(() -> new RuntimeException("GENERATION_FAILED"));
            return convertUserArticleToResponse(article);
        } else {
            throw new RuntimeException("INVALID_TYPE");
        }
    }

    @Override
    @Transactional
    public void completeArticle(Long userId, Long articleId) {
        UserArticle article = userArticleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("ARTICLE_NOT_FOUND"));

        if (!article.getUserId().equals(userId)) {
            throw new RuntimeException("UNAUTHORIZED");
        }

        // 标记为已完成
        article.setStatus("COMPLETED");
        article.setCompletedAt(LocalDateTime.now());
        userArticleRepository.save(article);

        // 检查队列长度，如果少于2篇则补充
        long readyCount = userArticleRepository.countByUserIdAndStatus(userId, "READY");
        if (readyCount < 2) {
            generateAndStoreCustomArticle(userId);
        }
    }

    @Override
    public void generateBatchForUser(Long userId, int count) {
        for (int i = 0; i < count; i++) {
            try {
                generateAndStoreCustomArticle(userId);
            } catch (Exception e) {
                System.err.println("生成第" + (i + 1) + "篇文章失败: " + e.getMessage());
            }
        }
    }

    /**
     * 生成并存储一篇定制文章
     */
    private void generateAndStoreCustomArticle(Long userId) {
        ArticleResponse response = generateArticle(userId, "intermediate");

        UserArticle article = new UserArticle();
        article.setUserId(userId);
        article.setTitle(response.getTitle());
        article.setContent(response.getContent());
        article.setStatus("READY");

        try {
            article.setWordBankJson(objectMapper.writeValueAsString(response.getWordBank()));
        } catch (Exception e) {
            throw new RuntimeException("序列化单词库失败", e);
        }

        userArticleRepository.save(article);
    }

    /**
     * 将 ArticleTemplate 转换为 ArticleResponse
     */
    private ArticleResponse convertTemplateToResponse(ArticleTemplate template) {
        ArticleResponse response = new ArticleResponse();
        response.setTitle(template.getTitle());
        response.setContent(template.getContent());

        try {
            if (template.getWordBankJson() != null && !template.getWordBankJson().isEmpty()) {
                List<ArticleResponse.WordItem> wordBank = objectMapper.readValue(
                        template.getWordBankJson(),
                        new TypeReference<List<ArticleResponse.WordItem>>() {}
                );
                response.setWordBank(wordBank);
            } else {
                response.setWordBank(new ArrayList<>());
            }
        } catch (Exception e) {
            response.setWordBank(new ArrayList<>());
        }

        return response;
    }

    /**
     * 将 UserArticle 转换为 ArticleResponse
     */
    private ArticleResponse convertUserArticleToResponse(UserArticle article) {
        ArticleResponse response = new ArticleResponse();
        response.setTitle(article.getTitle());
        response.setContent(article.getContent());
        response.setArticleId(article.getId()); // 添加文章ID供前端使用

        try {
            if (article.getWordBankJson() != null && !article.getWordBankJson().isEmpty()) {
                List<ArticleResponse.WordItem> wordBank = objectMapper.readValue(
                        article.getWordBankJson(),
                        new TypeReference<List<ArticleResponse.WordItem>>() {}
                );
                response.setWordBank(wordBank);
            } else {
                response.setWordBank(new ArrayList<>());
            }
        } catch (Exception e) {
            response.setWordBank(new ArrayList<>());
        }

        return response;
    }

    @Override
    @Transactional
    public void updateWordProgress(Long userId, Long articleId, String word, String state) {
        // 1. 查找文章
        UserArticle article = userArticleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("ARTICLE_NOT_FOUND"));

        if (!article.getUserId().equals(userId)) {
            throw new RuntimeException("UNAUTHORIZED");
        }

        try {
            // 2. 解析 wordBankJson
            List<ArticleResponse.WordItem> wordBank = objectMapper.readValue(
                    article.getWordBankJson(),
                    new TypeReference<List<ArticleResponse.WordItem>>() {}
            );

            // 3. 找到对应单词并更新状态
            boolean wordFound = false;
            for (ArticleResponse.WordItem item : wordBank) {
                if (item.getWord().equalsIgnoreCase(word)) {
                    item.setState(state);
                    wordFound = true;

                    // 4. 更新单词掌握度（如果有 wordId）
                    if (item.getId() != null) {
                        updateMasteryScore(userId, item.getId(), state);
                    }
                    break;
                }
            }

            if (!wordFound) {
                throw new RuntimeException("WORD_NOT_FOUND_IN_ARTICLE");
            }

            // 5. 序列化回 JSON 并保存
            article.setWordBankJson(objectMapper.writeValueAsString(wordBank));
            userArticleRepository.save(article);

        } catch (Exception e) {
            throw new RuntimeException("更新单词进度失败: " + e.getMessage(), e);
        }
    }

    /**
     * 更新用户单词掌握度
     */
    private void updateMasteryScore(Long userId, Long wordId, String state) {
        Optional<UserWordMastery> masteryOpt = userWordMasteryRepository
                .findByUserIdAndWordId(userId, wordId);

        if (masteryOpt.isPresent()) {
            UserWordMastery mastery = masteryOpt.get();
            int currentScore = mastery.getMasteryScore();

            if ("correct".equals(state)) {
                mastery.setMasteryScore(Math.min(100, currentScore + 1));
            } else if ("wrong".equals(state)) {
                mastery.setMasteryScore(Math.max(0, (int)(currentScore - 0.5)));
            }

            userWordMasteryRepository.save(mastery);
        }
    }
}
