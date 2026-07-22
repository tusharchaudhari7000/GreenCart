package com.marketplace.userservice.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.marketplace.userservice.dto.*;
import com.marketplace.userservice.entities.User;
import com.marketplace.userservice.services.UserServices;
import com.marketplace.userservice.utils.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/user")
@Tag(name = "User Management", description = "APIs for user registration, login, and retrieval")
public class UserController {

    @Autowired UserServices userServices;
    @Autowired JwtUtil jwtUtil;

    @GetMapping("/getall")
    @Operation(summary = "Get all users", description = "Fetches a list of all registered users in the system")
    public List<User> getAll() { return userServices.getAll(); }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Registers a new user and returns the created user details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully registered"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error (e.g., Invalid Question ID or duplicate user)")
    })
    public User registerUser(@RequestBody RegisterUserRequest request) {
        return userServices.registerUser(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user credentials and returns a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful login (Token generated)"),
            @ApiResponse(responseCode = "400", description = "Invalid credentials"),
            @ApiResponse(responseCode = "403", description = "Account not verified (PENDING state)")
    })
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userServices.login(request.getUsername(), request.getPassword());
            String role = switch (user.getRoleId()) {
                case 1 -> "ADMIN"; case 2 -> "FARMER"; case 3 -> "BUYER"; default -> "UNKNOWN";
            };
            String token = jwtUtil.generateToken(user);
            LoginResponse response = new LoginResponse(user.getUserId(), user.getUsername(),
                    user.getFirstName(), user.getLastName(), user.getEmail(), user.getPhone(),
                    role, user.getStatus(), token, jwtUtil.getExpirationTime());
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            if ("ACCOUNT_NOT_VERIFIED".equals(ex.getMessage()))
                return ResponseEntity.status(403).body("ACCOUNT_NOT_VERIFIED");
            return ResponseEntity.badRequest().body("INVALID_CREDENTIALS");
        }
    }
}
