package com.example.backend.services;

import com.example.backend.models.UserProfile;
import com.example.backend.storage.UserStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserStorage userStorage;

    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
    private static final int MAX_DIMENSION = 1024;
    private static final String AVATAR_DIRECTORY = "backend/data/avatars/";

    public UserProfile getUserProfile(String userId) {
        return userStorage.getUserProfile(userId);
    }

    public UserProfile updateUserProfile(String userId, UserProfile profile) {
        return userStorage.updateUserProfile(userId, profile);
    }

    public void uploadAvatar(String userId, MultipartFile avatar) {
        validateAvatar(avatar);
        String filename = saveAvatarToFileSystem(userId, avatar);
        UserProfile profile = userStorage.getUserProfile(userId);
        profile.setAvatarUrl(filename);
        userStorage.updateUserProfile(userId, profile);
    }

    private void validateAvatar(MultipartFile avatar) {
        if (!ALLOWED_FILE_TYPES.contains(avatar.getContentType())) {
            throw new IllegalArgumentException("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        }
        if (avatar.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 2 MB.");
        }
        try {
            BufferedImage image = ImageIO.read(avatar.getInputStream());
            if (image == null || image.getWidth() > MAX_DIMENSION || image.getHeight() > MAX_DIMENSION) {
                throw new IllegalArgumentException("Image dimensions exceed 1024x1024 px.");
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to read image file.");
        }
    }

    private String saveAvatarToFileSystem(String userId, MultipartFile avatar) {
        try {
            Files.createDirectories(Paths.get(AVATAR_DIRECTORY));
            String extension = avatar.getContentType().split("/")[1];
            String filename = userId + "-" + System.currentTimeMillis() + "." + extension;
            Path filePath = Paths.get(AVATAR_DIRECTORY + filename);
            Files.write(filePath, avatar.getBytes());
            return filename;
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to save avatar file.");
        }
    }
}
