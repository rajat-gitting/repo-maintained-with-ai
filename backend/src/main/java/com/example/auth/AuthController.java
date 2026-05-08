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
import java.util.List;
import java.util.ArrayList;
import java.util.regex.Pattern;
import java.io.IOException;
import java.nio.file.StandardOpenOption;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String USERS_FILE = "data/users.json";
    private static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY");
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private ObjectMapper objectMapper = new ObjectMapper();
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        try {
            String email = user.get("email");
            String password = user.get("password");

            if (!EMAIL_PATTERN.matcher(email).matches()) {
                return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
            }

            List<Map<String, String>> users = readUsersFromFile();
            for (Map<String, String> existingUser : users) {
                if (existingUser.get("email").equals(email)) {
                    return new ResponseEntity<>("Email already registered", HttpStatus.CONFLICT);
                }
            }

            String hashedPassword = passwordEncoder.encode(password);

            Map<String, String> userDetails = new HashMap<>();
            userDetails.put("id", UUID.randomUUID().toString());
            userDetails.put("email", email);
            userDetails.put("password", hashedPassword);

            users.add(userDetails);
            Files.write(Paths.get(USERS_FILE), objectMapper.writeValueAsBytes(users), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

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

            List<Map<String, String>> users = readUsersFromFile();
            for (Map<String, String> storedUser : users) {
                if (storedUser.get("email").equals(email) && passwordEncoder.matches(password, storedUser.get("password"))) {
                    String token = Jwts.builder()
                            .setSubject(email)
                            .setIssuedAt(new Date())
                            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiration
                            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                            .compact();

                    return new ResponseEntity<>(token, HttpStatus.OK);
                }
            }
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error accessing user data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<Map<String, String>> readUsersFromFile() throws IOException {
        if (Files.exists(Paths.get(USERS_FILE))) {
            byte[] jsonData = Files.readAllBytes(Paths.get(USERS_FILE));
            return objectMapper.readValue(jsonData, List.class);
        }
        return new ArrayList<>();
    }
}
