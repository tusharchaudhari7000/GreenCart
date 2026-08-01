package com.marketplace.userservice.controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.marketplace.userservice.dto.*;
import com.marketplace.userservice.entities.User;
import com.marketplace.userservice.services.UserServices;
import com.marketplace.userservice.utils.JwtUtil;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServices userServices;
    private final JwtUtil jwtUtil;

    public UserController(UserServices userServices, JwtUtil jwtUtil) {
        this.userServices = userServices;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/getall")
    public List<User> getAll() { return userServices.getAll(); }

    @PostMapping("/register")
    public User registerUser(@RequestBody RegisterUserRequest request) {
        return userServices.registerUser(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userServices.login(request.getUsername(), request.getPassword());
        String role = switch (user.getRoleId()) {
            case 1 -> "ADMIN"; case 2 -> "FARMER"; case 3 -> "BUYER"; default -> "UNKNOWN";
        };
        String token = jwtUtil.generateToken(user);
        LoginResponse response = new LoginResponse(user.getUserId(), user.getUsername(),
                user.getFirstName(), user.getLastName(), user.getEmail(), user.getPhone(),
                role, user.getStatus(), token, jwtUtil.getExpirationTime());
        return ResponseEntity.ok(response);
    }
}
