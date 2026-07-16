package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.response.WishlistResponse;
import com.adil.jkrjewellers.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getWishlist(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(wishlistService.getWishlist(email));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(Authentication authentication,
                                                             @PathVariable Long productId) {
        String email = authentication.getName();
        return ResponseEntity.ok(wishlistService.addToWishlist(email, productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(Authentication authentication,
                                                      @PathVariable Long productId) {
        String email = authentication.getName();
        wishlistService.removeFromWishlist(email, productId);
        return ResponseEntity.noContent().build();
    }
}