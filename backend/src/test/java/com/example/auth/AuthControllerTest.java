package com.example.auth;

import com.example.auth.model.User;
import com.example.auth.model.UserDto;
import com.example.auth.service.UserService;
import com.example.auth.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignUp() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setFirstName("John");
        userDto.setLastName("Doe");
        userDto.setEmail("john.doe@example.com");
        userDto.setPassword("password123");

        when(userService.signUp(userDto)).thenReturn(new User());

        ResponseEntity<User> response = authController.signUp(userDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void testLogin() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setEmail("john.doe@example.com");
        userDto.setPassword("password123");

        User user = new User();
        user.setEmail("john.doe@example.com");

        when(userService.login(userDto)).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("mocked_jwt_token");

        ResponseEntity<String> response = authController.login(userDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("mocked_jwt_token", response.getBody());
    }
}
