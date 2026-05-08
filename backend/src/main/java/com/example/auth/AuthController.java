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
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.ArrayList;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Optional;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCrypt;

@RestController
public class AuthController {

    private static final Path USERS_FILE_PATH = Paths.get("data/users.json");
    @Value("${jwt.secret.key.base64}")
    private String secretKeyBase64;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        try {
            String email = user.get("email");
            String password = user.get("password");

            // Check if user already exists
            List<Map<String, String>> users = getUsers();
            boolean userExists = users.stream().anyMatch(u -> u.get("email").equals(email));
            if (userExists) {
                return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
            }

            String hashedPassword = passwordEncoder.encode(password);
            Map<String, String> userDetails = new HashMap<>();
            userDetails.put("email", email);
            userDetails.put("password", hashedPassword);

            // Append user details to JSON file
            users.add(userDetails);
            Files.write(USERS_FILE_PATH, objectMapper.writeValueAsBytes(users), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error accessing user data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> user) {
        try {
            String email = user.get("email");
            String password = user.get("password");

            // Retrieve users and verify credentials
            List<Map<String, String>> users = getUsers();
            Optional<Map<String, String>> foundUser = users.stream().filter(u -> u.get("email").equals(email)).findFirst();

            if (foundUser.isEmpty() || !passwordEncoder.matches(password, foundUser.get().get("password"))) {
                return new ResponseEntity<>("Invalid login credentials", HttpStatus.UNAUTHORIZED);
            }

            String token = Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                    .signWith(SignatureAlgorithm.HS256, Base64.getDecoder().decode(secretKeyBase64))
                    .compact();

            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing login", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<Map<String, String>> getUsers() throws IOException {
        if (!Files.exists(USERS_FILE_PATH)) {
            return new ArrayList<>();
        }
        byte[] jsonData = Files.readAllBytes(USERS_FILE_PATH);
        return objectMapper.readValue(jsonData, new TypeReference<List<Map<String, String>>>() {});
    }
}
