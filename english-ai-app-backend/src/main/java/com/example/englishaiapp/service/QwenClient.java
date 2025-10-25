package com.example.englishaiapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class QwenClient {

    private static final String API_KEY = "sk-aa3fbb7f09c5437daedf5b773ec6e973";
    private static final String API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
    private static final String MODEL = "qwen-max";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 生成包含指定单词的文章
     * @param words 单词列表（含英文和中文释义）
     * @param difficulty 难度等级
     * @return 生成的文章JSON（包含title和content）
     */
    public Map<String, String> generateArticle(List<Map<String, String>> words, String difficulty) {
        try {
            // 构建 prompt
            String prompt = buildPrompt(words, difficulty);

            // 构建请求体
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL);
            
            Map<String, Object> input = new HashMap<>();
            input.put("messages", List.of(
                Map.of("role", "system", "content", "你是一名专业的英语学习内容创作者，擅长创作适合英语学习的短文。"),
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("input", input);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("result_format", "message");
            requestBody.put("parameters", parameters);

            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(API_KEY);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // 发送请求
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL, entity, String.class);

            // 解析响应
            return parseResponse(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("调用千问API失败: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(List<Map<String, String>> words, String difficulty) {
        StringBuilder sb = new StringBuilder();
        sb.append("请使用以下8个英文单词生成一篇约300字的英文短文（含标题）。\n\n");
        sb.append("要求：\n");
        sb.append("1. 文章主题围绕日常学习、成长或生活，内容积极向上\n");
        sb.append("2. 难度等级：").append(getDifficultyDescription(difficulty)).append("\n");
        sb.append("3. 每个单词在文章中只出现一次，并且必须用 [(单词)] 的格式标记出来\n");
        sb.append("4. 文章要自然流畅，上下文要能帮助读者理解单词含义\n");
        sb.append("5. 请直接返回JSON格式：{\"title\": \"文章标题\", \"content\": \"文章正文...\"}\n\n");
        
        sb.append("单词清单：\n");
        for (int i = 0; i < words.size(); i++) {
            Map<String, String> word = words.get(i);
            sb.append(i + 1).append(". ").append(word.get("word"))
              .append(" - ").append(word.get("meaning")).append("\n");
        }

        return sb.toString();
    }

    private String getDifficultyDescription(String difficulty) {
        return switch (difficulty.toLowerCase()) {
            case "beginner" -> "初级（使用简单句式和常见词汇）";
            case "advanced" -> "高级（可以使用复杂句式和高级词汇）";
            default -> "中级（适中难度，句式和词汇难度适中）";
        };
    }

    private Map<String, String> parseResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode output = root.path("output");
            JsonNode choices = output.path("choices");
            
            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message");
                String content = message.path("content").asText();
                
                // 尝试从content中解析JSON
                // 移除可能的markdown代码块标记
                content = content.replaceAll("```json\\s*", "").replaceAll("```\\s*$", "").trim();
                
                JsonNode articleJson = objectMapper.readTree(content);
                
                Map<String, String> result = new HashMap<>();
                result.put("title", articleJson.path("title").asText());
                result.put("content", articleJson.path("content").asText());
                
                return result;
            }
            
            throw new RuntimeException("千问API响应格式异常");
            
        } catch (Exception e) {
            throw new RuntimeException("解析千问API响应失败: " + e.getMessage(), e);
        }
    }
}
