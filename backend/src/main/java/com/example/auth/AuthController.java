package com.example.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String USERS_FILE = "data/users.json";
    private static final String SECRET_KEY = "mySecretKey";
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        try {
            String email = user.get("email");
            String password = user.get("password");
            String hashedPassword = passwordEncoder.encode(password);

            Map<String, String> userDetails = new HashMap<>();
            userDetails.put("id", UUID.randomUUID().toString());
            userDetails.put("email", email);
            userDetails.put("password", hashedPassword);

            Files.write(Paths.get(USERS_FILE), objectMapper.writeValueAsBytes(userDetails));

            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error registering user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> user) {
        try {
            String email = user.get("email");
            String password = user.get("password");

            byte[] jsonData = Files.readAllBytes(Paths.get(USERS_FILE));
            Map<String, String> storedUser = objectMapper.readValue(jsonData, Map.class);

            if (storedUser.get("email").equals(email) && passwordEncoder.matches(password, storedUser.get("password"))) {
                String token = Jwts.builder()
                        .setSubject(email)
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
                        .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                        .compact();

                return new ResponseEntity<>(token, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error logging in", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
