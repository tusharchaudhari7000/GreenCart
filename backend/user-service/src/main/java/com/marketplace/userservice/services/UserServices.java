package com.marketplace.userservice.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.marketplace.userservice.dto.RegisterUserRequest;
import com.marketplace.userservice.entities.SecurityQuestion;
import com.marketplace.userservice.entities.User;
import com.marketplace.userservice.enums.UserStatus;
import com.marketplace.userservice.repositories.SecurityQuestionRepo;
import com.marketplace.userservice.repositories.UserRepo;

@Service
public class UserServices {

    @Autowired UserRepo userrepo;
    @Autowired SecurityQuestionRepo questionRepo;
    @Autowired PasswordEncoder passwordEncoder;

    public List<User> getAll() { return userrepo.findAll(); }

    public User login(String username, String password) {
        User user = userrepo.findByUsername(username);
        if (user == null) throw new RuntimeException("INVALID_CREDENTIALS");
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("INVALID_CREDENTIALS");
        if (user.getStatus().equals(UserStatus.PENDING.getCode()))
            throw new RuntimeException("ACCOUNT_NOT_VERIFIED");
        return user;
    }

    public User registerUser(RegisterUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRoleId(request.getRoleId());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAnswer(request.getAnswer());
        user.setStatus(request.getRoleId() == 2 ? UserStatus.PENDING.getCode() : UserStatus.ACTIVE.getCode());

        SecurityQuestion q = questionRepo.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Invalid question"));
        user.setQuestion(q);

        return userrepo.save(user);
    }

    public User getByUsername(String username) { return userrepo.findByUsername(username); }
}
