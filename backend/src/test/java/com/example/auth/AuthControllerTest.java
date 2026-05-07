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
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignUpSuccess() throws Exception {
        UserDto userDto = new UserDto("John", "Doe", "john.doe@example.com", "password");
        User user = new User("1", "John", "Doe", "john.doe@example.com", "hashedPassword");

        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(authService.signUp(any(UserDto.class))).thenReturn(user);

        ResponseEntity<User> response = authController.signUp(userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(user, response.getBody());
    }

    @Test
    void testSignUpDuplicateEmail() throws Exception {
        UserDto userDto = new UserDto("John", "Doe", "john.doe@example.com", "password");

        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(authService.signUp(any(UserDto.class))).thenThrow(new DataIntegrityViolationException("Duplicate email"));

        ResponseEntity<User> response = authController.signUp(userDto);

        assertEquals(409, response.getStatusCodeValue());
        assertNull(response.getBody());
    }

    @Test
    void testLoginSuccess() {
        UserDto userDto = new UserDto("john.doe@example.com", "password");
        User user = new User("1", "John", "Doe", "john.doe@example.com", "hashedPassword");

        when(authService.login(any(UserDto.class))).thenReturn(user);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("jwtToken");

        ResponseEntity<String> response = authController.login(userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("jwtToken", response.getBody());
    }

    @Test
    void testLoginInvalidCredentials() {
        UserDto userDto = new UserDto("john.doe@example.com", "wrongpassword");

        when(authService.login(any(UserDto.class))).thenReturn(null);

        ResponseEntity<String> response = authController.login(userDto);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Invalid credentials", response.getBody());
    }
}
