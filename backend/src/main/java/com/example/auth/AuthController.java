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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
public class AuthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${jwt.secret.key.base64}")
    private String secretKeyBase64;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        // Check if user already exists
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE email = ?", Integer.class, email);
        if (count != null && count > 0) {
            return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
        }

        String hashedPassword = passwordEncoder.encode(password);
        jdbcTemplate.update("INSERT INTO users (email, password) VALUES (?, ?)", email, hashedPassword);

        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        try {
            User foundUser = jdbcTemplate.queryForObject("SELECT * FROM users WHERE email = ?", new Object[]{email}, new RowMapper<User>() {
                @Override
                public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                    return new User(rs.getString("email"), rs.getString("password"));
                }
            });

            if (foundUser == null || !passwordEncoder.matches(password, foundUser.getPassword())) {
                return new ResponseEntity<>("Invalid login credentials", HttpStatus.UNAUTHORIZED);
            }

            String token = Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                    .signWith(SignatureAlgorithm.HS256, Base64.getDecoder().decode(secretKeyBase64))
                    .compact();

            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing login", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private static class User {
        private String email;
        private String password;

        public User(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }
    }
}
