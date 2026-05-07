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
    void testSignUp() {
        UserDto userDto = new UserDto("John", "Doe", "john.doe@example.com", "password");
        User user = new User(1L, "John", "Doe", "john.doe@example.com", "hashedPassword");

        when(passwordEncoder.encode(userDto.getPassword())).thenReturn("hashedPassword");
        when(authService.signUp(userDto)).thenReturn(user);

        ResponseEntity<User> response = authController.signUp(userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(user, response.getBody());
    }

    @Test
    void testLoginSuccess() {
        UserDto userDto = new UserDto("john.doe@example.com", "password");
        User user = new User(1L, "John", "Doe", "john.doe@example.com", "hashedPassword");

        when(authService.login(userDto)).thenReturn(user);
        when(passwordEncoder.matches(userDto.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(user)).thenReturn("jwtToken");

        ResponseEntity<String> response = authController.login(userDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("jwtToken", response.getBody());
    }

    @Test
    void testLoginFailure() {
        UserDto userDto = new UserDto("john.doe@example.com", "wrongPassword");
        User user = new User(1L, "John", "Doe", "john.doe@example.com", "hashedPassword");

        when(authService.login(userDto)).thenReturn(user);
        when(passwordEncoder.matches(userDto.getPassword(), user.getPassword())).thenReturn(false);

        ResponseEntity<String> response = authController.login(userDto);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Invalid credentials", response.getBody());
    }
}
