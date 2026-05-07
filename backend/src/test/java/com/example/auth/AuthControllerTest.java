package com.example.auth;

import com.example.model.User;
import com.example.model.UserDto;
import com.example.service.AuthService;
import com.example.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignUpSuccess() {
        UserDto userDto = new UserDto("John", "Doe", "john.doe@example.com", "password");
        User user = new User(1L, "John", "Doe", "john.doe@example.com", "hashedPassword");

        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(authService.signUp(any())).thenReturn(user);

        ResponseEntity<User> response = authController.signUp(userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(user.getEmail(), response.getBody().getEmail());
    }

    @Test
    void testSignUpDuplicateEmail() {
        UserDto userDto = new UserDto("John", "Doe", "john.doe@example.com", "password");

        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        doThrow(new DataIntegrityViolationException("Duplicate email")).when(authService).signUp(any());

        ResponseEntity<User> response = authController.signUp(userDto);

        assertEquals(409, response.getStatusCodeValue());
    }

    @Test
    void testLoginSuccess() {
        UserDto userDto = new UserDto("john.doe@example.com", "password");
        User user = new User(1L, "John", "Doe", "john.doe@example.com", "hashedPassword");

        when(authService.login(any())).thenReturn(user);
        when(passwordEncoder.matches(any(), any())).thenReturn(true);
        when(jwtUtil.generateToken(any())).thenReturn("jwtToken");

        ResponseEntity<String> response = authController.login(userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("jwtToken", response.getBody());
    }

    @Test
    void testLoginInvalidCredentials() {
        UserDto userDto = new UserDto("john.doe@example.com", "wrongpassword");

        when(authService.login(any())).thenReturn(null);

        ResponseEntity<String> response = authController.login(userDto);

        assertEquals(401, response.getStatusCodeValue());
    }
}
