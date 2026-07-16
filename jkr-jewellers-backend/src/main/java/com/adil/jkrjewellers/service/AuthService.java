package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.request.LoginRequest;
import com.adil.jkrjewellers.dto.request.RegisterRequest;
import com.adil.jkrjewellers.dto.request.VerifyOtpRequest;
import com.adil.jkrjewellers.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse verifyOtp(VerifyOtpRequest request);

    void resendOtp(String email);

}