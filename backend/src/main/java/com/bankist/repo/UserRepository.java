package com.bankist.repo;

import com.bankist.annotations.LogRepository;
import com.bankist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@LogRepository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);
    boolean existsByUsernameOrEmail(String username, String email);
}
