package com.example.tms.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.tms.common.BizException;
import com.example.tms.dto.LoginRequest;
import com.example.tms.entity.SysUser;
import com.example.tms.mapper.SysUserMapper;
import com.example.tms.security.LoginUser;
import com.example.tms.security.TokenService;
import com.example.tms.security.UserContext;
import com.example.tms.service.AuthService;
import com.example.tms.vo.LoginView;

@Service
public class AuthServiceImpl implements AuthService {

    private final SysUserMapper sysUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthServiceImpl(SysUserMapper sysUserMapper, PasswordEncoder passwordEncoder,
                           TokenService tokenService) {
        this.sysUserMapper = sysUserMapper;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Override
    @Transactional
    public LoginView login(LoginRequest request) {
        SysUser user = sysUserMapper.selectOne(new QueryWrapper<SysUser>()
                .eq("username", request.getUsername().trim()));
        // 用户不存在与密码错误返回同一句话，避免账号枚举
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BizException("用户名或密码错误");
        }
        if (user.getStatus() == null || user.getStatus() != 1) {
            throw new BizException("账号已停用，请联系管理员");
        }
        user.setLastLoginTime(LocalDateTime.now());
        sysUserMapper.updateById(user);

        LoginUser loginUser = toLoginUser(user);
        LoginView view = new LoginView();
        view.setToken(tokenService.issue(loginUser));
        view.setUser(loginUser);
        return view;
    }

    @Override
    public void logout(String token) {
        tokenService.invalidate(token);
    }

    @Override
    public LoginUser currentUser() {
        return UserContext.require();
    }

    private static LoginUser toLoginUser(SysUser user) {
        LoginUser loginUser = new LoginUser();
        loginUser.setUserId(user.getId());
        loginUser.setUsername(user.getUsername());
        loginUser.setRealName(user.getRealName());
        loginUser.setRole(user.getRole());
        loginUser.setDepartmentId(user.getDepartmentId());
        return loginUser;
    }
}
