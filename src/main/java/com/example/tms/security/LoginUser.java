package com.example.tms.security;

import java.io.Serializable;

import lombok.Data;

/**
 * 登录态里保存的身份信息，不含密码。
 */
@Data
public class LoginUser implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;

    private String username;

    private String realName;

    private String role;

    private Long departmentId;
}
