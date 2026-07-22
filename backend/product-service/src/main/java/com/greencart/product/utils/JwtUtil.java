package com.greencart.product.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Inject secret key from application.properties
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.err.println("❌ JWT Validation Failed: Token expired - " + e.getMessage());
            return false;
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            System.err.println("❌ JWT Validation Failed: Malformed token - " + e.getMessage());
            return false;
        } catch (io.jsonwebtoken.security.SignatureException e) {
            System.err.println("❌ JWT Validation Failed: Invalid signature - " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("❌ JWT Validation Failed: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Extract username from token
     */
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            System.err.println("❌ Error extracting username from token: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Extract user ID from token
     */
    public Integer getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Integer userId = claims.get("userId", Integer.class);
            System.out.println("ℹ️ Extracted userId from token: " + userId);
            return userId;
        } catch (Exception e) {
            System.err.println("❌ Error extracting userId from token: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Extract role from token
     */
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }

    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
