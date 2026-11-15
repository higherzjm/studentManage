package com.example.tms.security;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 内存令牌仓库：单机部署够用，横向扩容时替换成 Redis 即可，接口不变。
 */
@Service
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);

    private static final class Session {
        final LoginUser user;
        volatile long lastAccess;

        Session(LoginUser user, long now) {
            this.user = user;
            this.lastAccess = now;
        }
    }

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    private final long idleMillis;

    public TokenService(@Value("${app.auth.token-idle-minutes:120}") long idleMinutes) {
        this.idleMillis = Duration.ofMinutes(idleMinutes).toMillis();
    }

    public String issue(LoginUser user) {
        purgeExpired();
        String token = UUID.randomUUID().toString().replace("-", "");
        sessions.put(token, new Session(user, System.currentTimeMillis()));
        return token;
    }

    /** 命中则续期空闲时间，过期或不存在返回 null。 */
    public LoginUser resolve(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        Session session = sessions.get(token);
        if (session == null) {
            return null;
        }
        long now = System.currentTimeMillis();
        if (now - session.lastAccess > idleMillis) {
            sessions.remove(token);
            return null;
        }
        session.lastAccess = now;
        return session.user;
    }

    public void invalidate(String token) {
        if (token != null) {
            sessions.remove(token);
        }
    }

    /** 登录失败次数保护等场景下按用户踢出所有会话。 */
    public void invalidateAllForUser(Long userId) {
        sessions.entrySet().removeIf(e -> userId.equals(e.getValue().user.getUserId()));
    }

    public int onlineCount() {
        purgeExpired();
        return sessions.size();
    }

    private void purgeExpired() {
        try {
            long deadline = System.currentTimeMillis() - idleMillis;
            int before = sessions.size();
            sessions.entrySet().removeIf(e -> e.getValue().lastAccess < deadline);
            int removed = before - sessions.size();
            if (removed > 0) {
                log.debug("清理过期会话 {} 个", removed);
            }
        } catch (Exception e) {
            log.warn("清理过期会话失败", e);
        }
    }
}
