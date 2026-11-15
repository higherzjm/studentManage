package com.example.tms.vo;

import com.example.tms.security.LoginUser;

import lombok.Data;

@Data
public class LoginView {

    private String token;

    private LoginUser user;
}
