package com.example.englishaiapp.controller;

import com.example.englishaiapp.domain.User;
import com.example.englishaiapp.dto.LoginRequest;
import com.example.englishaiapp.dto.RegisterRequest;
import com.example.englishaiapp.repository.UserRepository;
import com.example.englishaiapp.security.CustomUserDetails;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // 检查用户名是否已存在
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名已存在");
                error.put("code", "USERNAME_EXISTS");
                return ResponseEntity.badRequest().body(error);
            }

            // 检查邮箱是否已存在
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "邮箱已被注册");
                error.put("code", "EMAIL_EXISTS");
                return ResponseEntity.badRequest().body(error);
            }

            // 创建新用户
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());
            user.setArticlesUnlocked(false); // 默认未解锁定制文章

            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "注册成功");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "注册失败: " + e.getMessage());
            error.put("code", "REGISTER_FAILED");
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            // 查找用户
            Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名或密码错误");
                error.put("code", "INVALID_CREDENTIALS");
                return ResponseEntity.status(401).body(error);
            }

            User user = userOpt.get();

            // 验证密码
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名或密码错误");
                error.put("code", "INVALID_CREDENTIALS");
                return ResponseEntity.status(401).body(error);
            }

            // 创建认证对象并存入 SecurityContext
            CustomUserDetails userDetails = new CustomUserDetails(user);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);

            // 将 SecurityContext 存入 Session
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            // 返回用户信息
            Map<String, Object> response = new HashMap<>();
            response.put("message", "登录成功");
            response.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "nickname", user.getNickname(),
                    "articlesUnlocked", user.getArticlesUnlocked()
            ));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "登录失败: " + e.getMessage());
            error.put("code", "LOGIN_FAILED");
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();

        Map<String, String> response = new HashMap<>();
        response.put("message", "登出成功");
        return ResponseEntity.ok(response);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Optional<User> userOpt = userRepository.findById(userDetails.getId());
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "用户不存在");
            error.put("code", "USER_NOT_FOUND");
            return ResponseEntity.status(404).body(error);
        }

        User user = userOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("nickname", user.getNickname());
        response.put("articlesUnlocked", user.getArticlesUnlocked());
        return ResponseEntity.ok(response);
    }
}
