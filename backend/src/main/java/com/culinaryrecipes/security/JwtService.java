package com.culinaryrecipes.security;

import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public String generateToken(String username) {
        return "jwt-token-for-" + username;
    }
}