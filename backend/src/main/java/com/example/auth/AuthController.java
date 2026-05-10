package com.example.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    @Value("${jwt.secret.key.base64}")
    private String secretKeyBase64;

    @Value("${users.storage.path:backend/src/storage/users.json}")
    private String usersFilePath;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        try {
            Map<String, String> users = loadUsers();
            if (users.containsKey(email)) {
                return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
            }
            users.put(email, passwordEncoder.encode(password));
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
            Map<String, String> users = loadUsers();
            String storedHash = users.get(email);
            if (storedHash == null || !passwordEncoder.matches(password, storedHash)) {
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

    private Map<String, String> loadUsers() throws IOException {
        File file = new File(usersFilePath);
        if (!file.exists() || file.length() == 0) {
            return new HashMap<>();
        }
        return objectMapper.readValue(file, new TypeReference<Map<String, String>>() {});
    }

    private void saveUsers(Map<String, String> users) throws IOException {
        File file = new File(usersFilePath);
        file.getParentFile().mkdirs();
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, users);
    }
}
