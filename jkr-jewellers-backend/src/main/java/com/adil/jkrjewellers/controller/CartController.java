package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.request.CartItemRequest;
import com.adil.jkrjewellers.dto.response.CartResponse;
import com.adil.jkrjewellers.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.getCart(email));
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(Authentication authentication,
                                                     @RequestBody CartItemRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.addToCart(email, request));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(Authentication authentication,
                                                          @PathVariable Long cartItemId,
                                                          @RequestParam Integer quantity) {
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.updateCartItem(email, cartItemId, quantity));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(Authentication authentication,
                                                 @PathVariable Long cartItemId) {
        String email = authentication.getName();
        cartService.removeCartItem(email, cartItemId);
        return ResponseEntity.noContent().build();
    }
}