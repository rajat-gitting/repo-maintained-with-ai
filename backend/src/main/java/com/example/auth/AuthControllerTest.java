package com.example.auth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testSignupUser() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "test@example.com");
        user.put("password", "password123");

        ResponseEntity<String> response = restTemplate.postForEntity("/signup", user, String.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("User registered successfully", response.getBody());
    }

    @Test
    public void testSignupUserAlreadyExists() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "test@example.com");
        user.put("password", "password123");

        // First signup
        restTemplate.postForEntity("/signup", user, String.class);

        // Second signup attempt
        ResponseEntity<String> response = restTemplate.postForEntity("/signup", user, String.class);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("User already exists", response.getBody());
    }

    @Test
    public void testLoginUser() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "test@example.com");
        user.put("password", "password123");

        // Ensure user is signed up first
        restTemplate.postForEntity("/signup", user, String.class);

        ResponseEntity<String> response = restTemplate.postForEntity("/login", user, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Additional assertions can be made to check the token format
    }

    @Test
    public void testLoginUserInvalidCredentials() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "nonexistent@example.com");
        user.put("password", "wrongpassword");

        ResponseEntity<String> response = restTemplate.postForEntity("/login", user, String.class);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid login credentials", response.getBody());
    }

    @Test
    public void testFileIOErrorDuringSignup() {
        // Simulate file I/O error by setting an invalid path
        String originalFilePath = AuthController.USERS_FILE;
        AuthController.USERS_FILE = "/invalid/path/users.json";

        Map<String, String> user = new HashMap<>();
        user.put("email", "error@example.com");
        user.put("password", "password123");

        ResponseEntity<String> response = restTemplate.postForEntity("/signup", user, String.class);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error accessing user data", response.getBody());

        // Restore original file path
        AuthController.USERS_FILE = originalFilePath;
    }
}
