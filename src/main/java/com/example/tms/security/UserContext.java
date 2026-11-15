package com.example.tms.security;

/**
 * 当前请求的登录身份，由 AuthInterceptor 写入、请求结束时清除。
 */
public final class UserContext {

    private static final ThreadLocal<LoginUser> HOLDER = new ThreadLocal<>();

    private UserContext() {
    }

    static void set(LoginUser user) {
        HOLDER.set(user);
    }

    static void clear() {
        HOLDER.remove();
    }

    public static LoginUser get() {
        return HOLDER.get();
    }

    public static LoginUser require() {
        LoginUser user = HOLDER.get();
        if (user == null) {
            throw new IllegalStateException("当前请求没有登录上下文");
        }
        return user;
    }
}
