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

@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Get the profile of the logged-in user.
     *
     * @param authentication the authentication object containing user details
     * @return the user's profile information
     */
    @GetMapping
    public ResponseEntity<UserProfile> getUserProfile(Authentication authentication) {
        String userId = authentication.getName();
        UserProfile profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * Update the profile of the logged-in user.
     *
     * @param authentication the authentication object containing user details
     * @param profile the profile data to update
     * @return the updated profile information
     */
    @PutMapping
    public ResponseEntity<UserProfile> updateUserProfile(Authentication authentication, @RequestBody UserProfile profile) {
        String userId = authentication.getName();
        UserProfile updatedProfile = userService.updateUserProfile(userId, profile);
        return ResponseEntity.ok(updatedProfile);
    }
}
