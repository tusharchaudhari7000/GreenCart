package com.marketplace.userservice.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.marketplace.userservice.entities.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    User findByEmail(String email);
    List<User> findByRoleId(Integer roleId);
}
