package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.request.ChangePasswordRequest;
import com.adil.jkrjewellers.dto.request.UpdateProfileRequest;
import com.adil.jkrjewellers.dto.response.UserResponse;

public interface UserService {

    UserResponse getProfile(String email);

    UserResponse updateProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);

}