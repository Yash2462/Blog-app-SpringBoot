package com.blog_app.service;

public interface TokenBlacklistService {

    void blacklistToken(String token, long expiresAtMillis);
    boolean isTokenBlacklisted(String token);
}
