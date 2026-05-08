package com.example.backend.services;

import com.example.backend.models.UserProfile;
import com.example.backend.storage.UserStorage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

class UserServiceTest {

    @Mock
    private UserStorage userStorage;

    @Mock
    private MultipartFile avatar;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUploadAvatarInvalidFileType() {
        when(avatar.getContentType()).thenReturn("image/gif");
        when(avatar.getSize()).thenReturn(1024L);

        assertThrows(IllegalArgumentException.class, () -> {
            userService.uploadAvatar("user123", avatar);
        }, "Invalid file type. Only JPEG, PNG, and WebP are allowed.");
    }

    @Test
    void testUploadAvatarFileSizeExceedsLimit() {
        when(avatar.getContentType()).thenReturn("image/jpeg");
        when(avatar.getSize()).thenReturn(3 * 1024 * 1024L);

        assertThrows(IllegalArgumentException.class, () -> {
            userService.uploadAvatar("user123", avatar);
        }, "File size exceeds 2 MB.");
    }

    @Test
    void testUploadAvatarInvalidDimensions() throws IOException {
        when(avatar.getContentType()).thenReturn("image/jpeg");
        when(avatar.getSize()).thenReturn(1024L);
        when(avatar.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));

        assertThrows(IllegalArgumentException.class, () -> {
            userService.uploadAvatar("user123", avatar);
        }, "Image dimensions exceed 1024x1024 px.");
    }
}
