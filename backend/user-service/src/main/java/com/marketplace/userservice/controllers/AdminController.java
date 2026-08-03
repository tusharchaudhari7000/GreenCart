package com.marketplace.userservice.controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.marketplace.userservice.entities.User;
import com.marketplace.userservice.repositories.UserRepo;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepo userRepo;

    public AdminController(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping("/farmers")
    public ResponseEntity<List<User>> getFarmers() {
        List<User> farmers = userRepo.findByRoleId(2);
        return ResponseEntity.ok(farmers);
    }

    @GetMapping("/buyers")
    public ResponseEntity<List<User>> getBuyers() {
        List<User> buyers = userRepo.findByRoleId(3);
        return ResponseEntity.ok(buyers);
    }

    @PostMapping("/farmers/{id}/approve")
    public ResponseEntity<User> approveFarmer(@PathVariable Integer id) {
        User user = userRepo.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(1); // 1 = ACTIVE / APPROVED
        userRepo.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<User> suspendUser(@PathVariable Integer id) {
        User user = userRepo.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setStatus(3); // 3 = SUSPENDED
        userRepo.save(user);
        return ResponseEntity.ok(user);
    }
}
