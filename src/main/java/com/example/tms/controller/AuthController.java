package com.example.tms.controller;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tms.common.ApiResult;
import com.example.tms.dto.LoginRequest;
import com.example.tms.security.AuthInterceptor;
import com.example.tms.security.LoginUser;
import com.example.tms.service.AuthService;
import com.example.tms.vo.LoginView;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResult<LoginView> login(@Valid @RequestBody LoginRequest request) {
        return ApiResult.ok(authService.login(request), "登录成功");
    }

    /** 登出允许在无有效会话时调用，前端清掉本地令牌即可。 */
    @PostMapping("/logout")
    public ApiResult<Void> logout(HttpServletRequest request) {
        authService.logout(request.getHeader(AuthInterceptor.TOKEN_HEADER));
        return ApiResult.ok(null, "已退出登录");
    }

    @GetMapping("/current")
    public ApiResult<LoginUser> current() {
        return ApiResult.ok(authService.currentUser());
    }
}
