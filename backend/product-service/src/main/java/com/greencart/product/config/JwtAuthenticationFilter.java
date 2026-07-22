package com.greencart.product.config;

import com.greencart.product.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import jakarta.servlet.http.Cookie;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        Integer userId = null;

        logger.info("🔍 JWT Filter - Processing request to: " + request.getRequestURI());
        logger.info("📋 All request headers:");
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            logger.info("  " + headerName + ": " + request.getHeader(headerName));
        }

        // Extract token from Authorization header or Cookies
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.info("✅ Token extracted from Authorization header");
        } else if (request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
                    .filter(c -> "jwt".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
            if (token != null) {
                logger.info("✅ Token extracted from HttpOnly Cookie");
            }
        }

        if (token != null) {
            logger.info("🔑 Full token: " + token);
            try {
                username = jwtUtil.getUsernameFromToken(token);
                userId = jwtUtil.getUserIdFromToken(token);
                logger.info("✅ Username extracted: " + username);
                logger.info("✅ User ID extracted: " + userId);
            } catch (Exception e) {
                logger.error("❌ Error extracting data from token: " + e.getMessage());
                logger.error("❌ Exception type: " + e.getClass().getName());
                e.printStackTrace();
            }
        } else {
            logger.error("❌ No Authorization header or jwt cookie found");
            logger.error("❌ authHeader value: " + authHeader);
        }

        // Validate token and set authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.info("🔐 Validating token for user: " + username);

            if (jwtUtil.validateToken(token)) {
                logger.info("✅ Token validation SUCCESS");

                // Extract role from token and add ROLE_ prefix for Spring Security
                String role = null;
                try {
                    role = jwtUtil.getRoleFromToken(token);
                    logger.info("📋 Role extracted from token: " + role);
                } catch (Exception e) {
                    logger.error("❌ Error extracting role from token: " + e.getMessage());
                }

                // Create authorities with ROLE_ prefix (required by Spring Security)
                List<GrantedAuthority> authorities = new ArrayList<>();
                if (role != null) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                    logger.info("✅ Authority granted: ROLE_" + role);
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null,
                        authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // Set user ID as request attribute so controllers can access it
                if (userId != null) {
                    request.setAttribute("X-User-Id", userId);
                    // Also add as a wrapper to make it available as header
                    request = new HttpServletRequestWrapper(request, userId);
                    logger.info("✅ X-User-Id header set to: " + userId);
                } else {
                    logger.error("❌ User ID is null, cannot set X-User-Id header");
                }
            } else {
                logger.error("❌ Token validation FAILED");
            }
        } else if (username == null) {
            logger.warn("⚠️ Username is null, skipping authentication");
        } else {
            logger.info("ℹ️ Authentication already set for this request");
        }

        filterChain.doFilter(request, response);
    }

    // Custom request wrapper to add X-User-Id header
    private static class HttpServletRequestWrapper extends jakarta.servlet.http.HttpServletRequestWrapper {
        private final Integer userId;

        public HttpServletRequestWrapper(HttpServletRequest request, Integer userId) {
            super(request);
            this.userId = userId;
        }

        @Override
        public String getHeader(String name) {
            if ("X-User-Id".equalsIgnoreCase(name) && userId != null) {
                return String.valueOf(userId);
            }
            return super.getHeader(name);
        }

        @Override
        public int getIntHeader(String name) {
            if ("X-User-Id".equalsIgnoreCase(name) && userId != null) {
                return userId;
            }
            return super.getIntHeader(name);
        }

        @Override
        public java.util.Enumeration<String> getHeaders(String name) {
            if ("X-User-Id".equalsIgnoreCase(name) && userId != null) {
                return java.util.Collections.enumeration(java.util.Collections.singletonList(String.valueOf(userId)));
            }
            return super.getHeaders(name);
        }

        @Override
        public java.util.Enumeration<String> getHeaderNames() {
            java.util.List<String> names = new java.util.ArrayList<>(
                    java.util.Collections.list(super.getHeaderNames()));
            if (userId != null && names.stream().noneMatch(n -> n.equalsIgnoreCase("X-User-Id"))) {
                names.add("X-User-Id");
            }
            return java.util.Collections.enumeration(names);
        }
    }
}
