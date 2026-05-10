package com.example.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "jwt.secret.key.base64=dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdG9rZW4tZ2VuZXJhdGlvbg=="
})
public class AuthControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private static final Path USERS_FILE_PATH = Paths.get("data/users.json");

    @BeforeEach
    public void setUp() throws IOException {
        if (Files.exists(USERS_FILE_PATH)) {
            Files.delete(USERS_FILE_PATH);
        }
    }

    @Test
    public void testSignupUserCreatesUserInJsonFile() throws IOException {
        Map<String, String> user = new HashMap<>();
        user.put("email", "test@example.com");
        user.put("password", "password123");

        ResponseEntity<String> response = restTemplate.postForEntity("/signup", user, String.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("User registered successfully", response.getBody());
        assertTrue(Files.exists(USERS_FILE_PATH));

        String content = new String(Files.readAllBytes(USERS_FILE_PATH));
        assertTrue(content.contains("test@example.com"));
        assertFalse(content.contains("password123"));
    }

    @Test
    public void testSignupUserWithExistingEmailReturnsConflict() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "duplicate@example.com");
        user.put("password", "password123");

        restTemplate.postForEntity("/signup", user, String.class);
        ResponseEntity<String> response = restTemplate.postForEntity("/signup", user, String.class);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("User already exists", response.getBody());
    }

    @Test
    public void testLoginUserWithValidCredentialsReturnsToken() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "login@example.com");
        user.put("password", "password123");

        restTemplate.postForEntity("/signup", user, String.class);

        ResponseEntity<String> response = restTemplate.postForEntity("/login", user, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length() > 0);
    }

    @Test
    public void testLoginUserWithInvalidCredentialsReturnsUnauthorized() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "nonexistent@example.com");
        user.put("password", "wrongpassword");

        ResponseEntity<String> response = restTemplate.postForEntity("/login", user, String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid login credentials", response.getBody());
    }

    @Test
    public void testLoginUserWithWrongPasswordReturnsUnauthorized() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "wrongpass@example.com");
        user.put("password", "correctpassword");

        restTemplate.postForEntity("/signup", user, String.class);

        Map<String, String> loginAttempt = new HashMap<>();
        loginAttempt.put("email", "wrongpass@example.com");
        loginAttempt.put("password", "wrongpassword");

        ResponseEntity<String> response = restTemplate.postForEntity("/login", loginAttempt, String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid login credentials", response.getBody());
    }

    @Test
    public void testSignupCreatesDataDirectoryIfNotExists() throws IOException {
        Path dataDir = Paths.get("data");
        if (Files.exists(dataDir)) {
            Files.walk(dataDir)
                .sorted((a, b) -> b.compareTo(a))
                .forEach(path -> {
                    try {
                        Files.deleteIfExists(path);
                    } catch (IOException e) {
                        // Ignore
                    }
                });
        }

        Map<String, String> user = new HashMap<>();
        user.put("email", "newdir@example.com");
        user.put("password", "password123");

        ResponseEntity<String> response = restTemplate.postForEntity("/signup", user, String.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(Files.exists(dataDir));
        assertTrue(Files.exists(USERS_FILE_PATH));
    }
}