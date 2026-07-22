package com.marketplace.userservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.marketplace.userservice.entities.SecurityQuestion;

public interface SecurityQuestionRepo extends JpaRepository<SecurityQuestion, Integer> {}
