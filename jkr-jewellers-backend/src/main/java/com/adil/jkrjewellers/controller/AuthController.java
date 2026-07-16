package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.request.LoginRequest;
import com.adil.jkrjewellers.dto.request.RegisterRequest;
import com.adil.jkrjewellers.dto.request.VerifyOtpRequest;
import com.adil.jkrjewellers.dto.response.AuthResponse;
import com.adil.jkrjewellers.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));

    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        return ResponseEntity.ok(authService.verifyOtp(request));

    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(
            @RequestParam String email) {

        authService.resendOtp(email);

        return ResponseEntity.ok("OTP Sent Successfully");

    }

}