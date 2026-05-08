package com.example.backend.controllers;

import com.example.backend.models.UserProfile;
import com.example.backend.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserProfile() {
        String userId = "user123";
        UserProfile mockProfile = new UserProfile();
        mockProfile.setUsername("user123");
        mockProfile.setEmail("user123@example.com");

        when(authentication.getName()).thenReturn(userId);
        when(userService.getUserProfile(userId)).thenReturn(mockProfile);

        ResponseEntity<UserProfile> response = userController.getUserProfile(authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockProfile, response.getBody());
    }

    @Test
    void testUpdateUserProfile() {
        String userId = "user123";
        UserProfile mockProfile = new UserProfile();
        mockProfile.setFirstName("John");
        mockProfile.setLastName("Doe");

        when(authentication.getName()).thenReturn(userId);
        when(userService.updateUserProfile(userId, mockProfile)).thenReturn(mockProfile);

        ResponseEntity<UserProfile> response = userController.updateUserProfile(authentication, mockProfile);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockProfile, response.getBody());
    }
}
