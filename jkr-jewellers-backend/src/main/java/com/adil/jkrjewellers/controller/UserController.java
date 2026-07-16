package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.request.ChangePasswordRequest;
import com.adil.jkrjewellers.dto.request.UpdateProfileRequest;
import com.adil.jkrjewellers.dto.response.UserResponse;
import com.adil.jkrjewellers.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userService.getProfile(email)
        );

    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userService.updateProfile(email, request)
        );

    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();

        userService.changePassword(email, request);

        return ResponseEntity.ok("Password changed successfully");
    }

}