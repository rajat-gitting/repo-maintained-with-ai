package com.example.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import java.util.Base64;
import java.util.List;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@RestController
public class AuthController {

    private static final Path USERS_FILE_PATH = Paths.get("data/users.json");
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${jwt.secret.key.base64}")
    private String secretKeyBase64;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        try {
            List<Map<String, String>> users = loadUsers();

            for (Map<String, String> existingUser : users) {
                if (email.equals(existingUser.get("email"))) {
                    return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
                }
            }

            String hashedPassword = passwordEncoder.encode(password);
            Map<String, String> newUser = new HashMap<>();
            newUser.put("email", email);
            newUser.put("password", hashedPassword);
            users.add(newUser);

            saveUsers(users);

            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing signup", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        try {
            List<Map<String, String>> users = loadUsers();
            Map<String, String> foundUser = null;

            for (Map<String, String> existingUser : users) {
                if (email.equals(existingUser.get("email"))) {
                    foundUser = existingUser;
                    break;
                }
            }

            if (foundUser == null || !passwordEncoder.matches(password, foundUser.get("password"))) {
                return new ResponseEntity<>("Invalid login credentials", HttpStatus.UNAUTHORIZED);
            }

            String token = Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                    .signWith(SignatureAlgorithm.HS256, Base64.getDecoder().decode(secretKeyBase64))
                    .compact();

            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing login", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<Map<String, String>> loadUsers() throws IOException {
        if (!Files.exists(USERS_FILE_PATH)) {
            Files.createDirectories(USERS_FILE_PATH.getParent());
            Files.write(USERS_FILE_PATH, "[]".getBytes(), StandardOpenOption.CREATE);
            return new ArrayList<>();
        }

        String content = new String(Files.readAllBytes(USERS_FILE_PATH));
        if (content.trim().isEmpty()) {
            return new ArrayList<>();
        }

        return objectMapper.readValue(content, new TypeReference<List<Map<String, String>>>() {});
    }

    private void saveUsers(List<Map<String, String>> users) throws IOException {
        String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(users);
        Files.write(USERS_FILE_PATH, json.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }
}