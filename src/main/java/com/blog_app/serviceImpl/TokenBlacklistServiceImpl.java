package com.blog_app.serviceImpl;

import com.blog_app.service.TokenBlacklistService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    @Override
    public void blacklistToken(String token, long expiresAtMillis) {
        blacklist.put(token, expiresAtMillis);
    }

    @Override
    public boolean isTokenBlacklisted(String token) {
        Long expiry = blacklist.get(token);
        if (expiry == null) return false;

        // Optional: remove if expired
        if (System.currentTimeMillis() > expiry) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }

    // Scheduled task to clean up expired tokens
    @Scheduled(fixedRate = 60_000) // every 60 seconds
    public void cleanupExpiredTokens() {
        blacklist.entrySet().removeIf(entry -> entry.getValue() < System.currentTimeMillis());
    }

}
