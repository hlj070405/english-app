


package com.example.englishaiapp.service;

import com.example.englishaiapp.domain.User;

public interface UserService {

    User register(User user);

    User login(String username, String password);
}
