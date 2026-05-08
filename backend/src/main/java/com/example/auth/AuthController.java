package com.example.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@RestController
public class AuthController {

    private static final String USERS_FILE_PATH = "data/users.json";
    private static final String SECRET_KEY = "mySecretKey";
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required.");
        }

        String hashedPassword = passwordEncoder.encode(password);
        Map<String, String> userDetails = new HashMap<>();
        userDetails.put("email", email);
        userDetails.put("password", hashedPassword);

        try {
            Map<String, Map<String, String>> users = loadUsers();
            users.put(email, userDetails);
            saveUsers(users);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user data.");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required.");
        }

        try {
            Map<String, Map<String, String>> users = loadUsers();
            Map<String, String> userDetails = users.get(email);

            if (userDetails != null && passwordEncoder.matches(password, userDetails.get("password"))) {
                String token = Jwts.builder()
                        .setSubject(email)
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                        .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                        .compact();
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading user data.");
        }
    }

    private Map<String, Map<String, String>> loadUsers() throws IOException {
        if (!Files.exists(Paths.get(USERS_FILE_PATH))) {
            return new HashMap<>();
        }
        return objectMapper.readValue(Files.readAllBytes(Paths.get(USERS_FILE_PATH)), new TypeReference<Map<String, Map<String, String>>>() {});
    }

    private void saveUsers(Map<String, Map<String, String>> users) throws IOException {
        try (FileWriter fileWriter = new FileWriter(USERS_FILE_PATH)) {
            objectMapper.writeValue(fileWriter, users);
        }
    }
}
