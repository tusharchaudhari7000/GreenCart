package com.greencart.api_gateway.filter;

import com.greencart.api_gateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Allow OPTIONS preflight requests and public endpoints (login, register, forgot-password, security questions, locations, product catalog)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || 
            path.startsWith("/user/login") || 
            path.startsWith("/user/register") ||
            path.startsWith("/user/forgot-password") ||
            path.startsWith("/security/") ||
            path.startsWith("/location/") ||
            path.startsWith("/api/products/available") ||
            path.startsWith("/api/categories")) {
            
            // If authorization header is provided anyway, extract user headers
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String token = authHeader.substring(7);
                    jwtUtil.validateToken(token);
                    Claims claims = jwtUtil.extractAllClaims(token);
                    String userId = String.valueOf(claims.get("userId"));
                    String role = claims.get("role", String.class);
                    
                    MutableHttpServletRequest mutableRequest = new MutableHttpServletRequest(request);
                    mutableRequest.putHeader("X-User-Id", userId);
                    mutableRequest.putHeader("X-User-Role", role);
                    filterChain.doFilter(mutableRequest, response);
                    return;
                } catch (Exception ignored) {}
            }

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);
        MutableHttpServletRequest mutableRequest = null;
        try {
            jwtUtil.validateToken(token);
            
            // Extract claims to pass to downstream services
            Claims claims = jwtUtil.extractAllClaims(token);
            String userId = String.valueOf(claims.get("userId"));
            String role = claims.get("role", String.class);

            mutableRequest = new MutableHttpServletRequest(request);
            mutableRequest.putHeader("X-User-Id", userId);
            mutableRequest.putHeader("X-User-Role", role);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Token: " + e.getMessage());
            e.printStackTrace();
            return;
        }

        filterChain.doFilter(mutableRequest, response);
    }
}
