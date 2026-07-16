package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.response.WishlistResponse;

import java.util.List;

public interface WishlistService {
    List<WishlistResponse> getWishlist(String email);
    WishlistResponse addToWishlist(String email, Long productId);
    void removeFromWishlist(String email, Long productId);
}