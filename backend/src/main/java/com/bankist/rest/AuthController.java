package com.bankist.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bankist.dto.ErrorResponse;
import com.bankist.dto.RegisterRequest;
import com.bankist.dto.RegisterResponse;
import com.bankist.exception.InvalidPasswordException;
import com.bankist.exception.PasswordMismatchException;
import com.bankist.exception.UserAlreadyExistsException;
import com.bankist.exception.UserNotFoundException;
import com.bankist.model.User;
import com.bankist.service.UserService;
import com.bankist.security.JwtProvider;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            RegisterResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (UserAlreadyExistsException | PasswordMismatchException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            User user = userService.authenticate(credentials.get("username"), credentials.get("password"));
            String token = jwtProvider.generateToken(user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());

            return ResponseEntity.ok(response);
        } catch (UserNotFoundException | InvalidPasswordException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}