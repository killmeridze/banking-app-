package com.bankist.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.bankist.annotations.LogService;
import com.bankist.dto.AuthResponse;
import com.bankist.dto.RegisterRequest;
import com.bankist.dto.UserExistsResponse;
import com.bankist.exception.InvalidPasswordException;
import com.bankist.exception.PasswordMismatchException;
import com.bankist.exception.UserAlreadyExistsException;
import com.bankist.exception.UserNotFoundException;
import com.bankist.model.User;
import com.bankist.repo.UserRepository;
import com.bankist.security.JwtProvider;

import java.util.List;
import java.util.Optional;

@Service
@LogService
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtProvider jwtProvider;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user, String currency) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            User savedUser = userRepository.save(user);
            return savedUser;
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with provided username or email already exists.", e);
        }
    }

    public boolean existsByUsername(String username) {
        // Check if a user with the specified username exists
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        // Check if a user with the specified email exists
        return userRepository.existsByEmail(email);
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("Пользователь с таким именем не существует"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException("Неправильный пароль");
        }

        return user;
    }

    public boolean deleteUserById(Long id) {
        // Delete a user by their ID
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public AuthResponse register(RegisterRequest request) {
        UserExistsResponse existsCheck = checkUserExists(request.getUsername(), request.getEmail());
        
        if (existsCheck.isUsernameExists() || existsCheck.isEmailExists()) {
            throw new UserAlreadyExistsException(
                existsCheck.isUsernameExists() ? 
                "Пользователь с таким именем уже существует" : 
                "Пользователь с таким email уже существует"
            );
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new PasswordMismatchException("Passwords don't match");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        userRepository.save(user);
        
        return new AuthResponse(jwtProvider.generateToken(user.getUsername()));
    }

    public UserExistsResponse checkUserExists(String username, String email) {
        boolean usernameExists = userRepository.existsByUsername(username);
        boolean emailExists = userRepository.existsByEmail(email);
        
        return new UserExistsResponse(
            usernameExists,
            emailExists,
            usernameExists ? "Username already taken" : null,
            emailExists ? "Email already registered" : null
        );
    }
}
