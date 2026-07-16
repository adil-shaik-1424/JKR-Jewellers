package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.request.CartItemRequest;
import com.adil.jkrjewellers.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(String email);
    CartResponse addToCart(String email, CartItemRequest request);
    CartResponse updateCartItem(String email, Long cartItemId, Integer quantity);
    void removeCartItem(String email, Long cartItemId);
}