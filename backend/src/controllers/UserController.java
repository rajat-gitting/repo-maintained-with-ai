package com.example.backend.controllers;

import com.example.backend.services.UserService;
import com.example.backend.models.UserProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<UserProfile> getUserProfile(Authentication authentication) {
        String userId = authentication.getName();
        UserProfile profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateUserProfile(Authentication authentication, @RequestBody UserProfile profile) {
        String userId = authentication.getName();
        UserProfile updatedProfile = userService.updateUserProfile(userId, profile);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(Authentication authentication, @RequestParam("avatar") MultipartFile avatar) {
        String userId = authentication.getName();
        try {
            userService.uploadAvatar(userId, avatar);
            return ResponseEntity.ok("Avatar uploaded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
