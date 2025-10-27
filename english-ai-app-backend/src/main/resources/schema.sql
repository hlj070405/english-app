-- 确保数据库使用 UTF-8 编码
ALTER DATABASE english_ai_app
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- 确保 article_templates 表使用 UTF-8 编码
ALTER TABLE article_templates
  CONVERT TO CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 确保 words 表使用 UTF-8 编码
ALTER TABLE words
  CONVERT TO CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 确保 user_word_mastery 表使用 UTF-8 编码
ALTER TABLE user_word_mastery
  CONVERT TO CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 确保 user_articles 表使用 UTF-8 编码
ALTER TABLE user_articles
  CONVERT TO CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- 确保 users 表使用 UTF-8 编码
ALTER TABLE users
  CONVERT TO CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
