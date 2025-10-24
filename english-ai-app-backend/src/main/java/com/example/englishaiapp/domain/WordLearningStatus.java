package com.example.englishaiapp.domain;

public enum WordLearningStatus {
    LEARNING,  // 正在学习（出现在常规队列中）
    MASTERED   // 已短期掌握（从常规队列中移除）
}
