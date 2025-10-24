package com.example.englishaiapp.controller;

import com.example.englishaiapp.domain.User;
import com.example.englishaiapp.dto.UserDTO;
import com.example.englishaiapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            return ResponseEntity.ok(new UserDTO(registeredUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest loginRequest) {
        try {
            User loggedInUser = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(new UserDTO(loggedInUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DTO for login request
    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
