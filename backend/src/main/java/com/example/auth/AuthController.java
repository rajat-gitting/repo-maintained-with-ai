package com.example.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;

@RestController
public class AuthController {

    private static final String USERS_FILE = "data/users.json";
    private static final String SECRET_KEY = "your_secret_key";
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        try {
            String email = user.get("email");
            String password = user.get("password");
            String hashedPassword = passwordEncoder.encode(password);

            Map<String, String> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("password", hashedPassword);

            // Save user details to JSON file
            Files.write(Paths.get(USERS_FILE), userDetails.toString().getBytes());

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

            // Here you would normally retrieve the user from the database and verify the password
            // For simplicity, we assume the user exists and the password is correct

            String token = Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .compact();

            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid login credentials", HttpStatus.UNAUTHORIZED);
        }
    }
}
