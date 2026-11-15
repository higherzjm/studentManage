package com.example.tms.service;

import com.example.tms.dto.LoginRequest;
import com.example.tms.security.LoginUser;
import com.example.tms.vo.LoginView;

public interface AuthService {

    LoginView login(LoginRequest request);

    void logout(String token);

    LoginUser currentUser();
}
