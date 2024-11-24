package com.bankist.rest;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.bankist.model.Card;
import com.bankist.model.User;
import com.bankist.repo.UserRepository;
import com.bankist.security.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bankist.service.CardService;

import java.util.Map;
import java.util.Optional;
import java.util.Collections;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CardService cardService;  

    public UserController(UserRepository userRepository, 
                         PasswordEncoder passwordEncoder,
                         JwtProvider jwtProvider,
                         CardService cardService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.cardService = cardService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registrationData) {
        String username = registrationData.get("username");
        String email = registrationData.get("email");
        String password = registrationData.get("password");

        if (username == null || email == null || password == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Username or email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        
        userRepository.save(user);

        String token = jwtProvider.generateToken(username);
        
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login") 
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");


        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Пользователь с таким именем не существует"));
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Неправильный пароль"));
        }

        String token = jwtProvider.generateToken(user.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isPresent()) {
                return ResponseEntity.ok().body(Map.of("userId", userId));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                   .body("Failed to fetch user data.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkUserExists(
            @RequestParam String username,
            @RequestParam String email) {
        return ResponseEntity.ok(
            userRepository.existsByUsername(username) || 
            userRepository.existsByEmail(email)
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return userRepository.findById(userId)
            .map(user -> {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                response.put("cards", user.getCards());
                
                Card firstCard = cardService.getFirstCardByUserId(user.getId());
                if (firstCard != null) {
                    response.put("balance", firstCard.getBalance());
                    response.put("currency", firstCard.getCurrency());
                } else {
                    response.put("balance", 0.0);
                    response.put("currency", "USD");
                }
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
