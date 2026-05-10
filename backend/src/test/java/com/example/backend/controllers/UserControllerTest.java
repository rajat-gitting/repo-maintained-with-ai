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
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doThrow;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @Mock
    private MultipartFile avatar;

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

    @Test
    void testUploadAvatarSuccess() {
        String userId = "user123";

        when(authentication.getName()).thenReturn(userId);

        ResponseEntity<String> response = userController.uploadAvatar(authentication, avatar);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Avatar uploaded successfully", response.getBody());
    }

    @Test
    void testUploadAvatarInvalidFileType() {
        String userId = "user123";

        when(authentication.getName()).thenReturn(userId);
        doThrow(new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and WebP are allowed.")).when(userService).uploadAvatar(userId, avatar);

        ResponseEntity<String> response = userController.uploadAvatar(authentication, avatar);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid file type. Only JPEG, PNG, and WebP are allowed.", response.getBody());
    }

    @Test
    void testUploadAvatarFileSizeExceedsLimit() {
        String userId = "user123";

        when(authentication.getName()).thenReturn(userId);
        doThrow(new IllegalArgumentException("File size exceeds 2 MB.")).when(userService).uploadAvatar(userId, avatar);

        ResponseEntity<String> response = userController.uploadAvatar(authentication, avatar);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("File size exceeds 2 MB.", response.getBody());
    }

    @Test
    void testUploadAvatarInvalidDimensions() {
        String userId = "user123";

        when(authentication.getName()).thenReturn(userId);
        doThrow(new IllegalArgumentException("Image dimensions exceed 1024x1024 px.")).when(userService).uploadAvatar(userId, avatar);

        ResponseEntity<String> response = userController.uploadAvatar(authentication, avatar);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Image dimensions exceed 1024x1024 px.", response.getBody());
    }
}
