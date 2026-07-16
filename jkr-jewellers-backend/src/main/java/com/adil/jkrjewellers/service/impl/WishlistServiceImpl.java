package com.adil.jkrjewellers.service.impl;

import com.adil.jkrjewellers.dto.response.WishlistResponse;
import com.adil.jkrjewellers.entity.Product;
import com.adil.jkrjewellers.entity.User;
import com.adil.jkrjewellers.entity.Wishlist;
import com.adil.jkrjewellers.repository.ProductRepository;
import com.adil.jkrjewellers.repository.UserRepository;
import com.adil.jkrjewellers.repository.WishlistRepository;
import com.adil.jkrjewellers.service.WishlistService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<WishlistResponse> getWishlist(String email) {

        User user = getUser(email);

        return wishlistRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WishlistResponse addToWishlist(String email, Long productId) {

        User user = getUser(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .ifPresent(w -> {
                    throw new RuntimeException("Product already in wishlist");
                });

        Wishlist wishlist = new Wishlist();

        wishlist.setUser(user);

        wishlist.setProduct(product);

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        return mapToResponse(savedWishlist);
    }

    @Override
    public void removeFromWishlist(String email, Long productId) {

        User user = getUser(email);

        Wishlist wishlist = wishlistRepository
                .findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        wishlistRepository.delete(wishlist);
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private WishlistResponse mapToResponse(Wishlist wishlist) {

        WishlistResponse response = new WishlistResponse();

        response.setWishlistId(wishlist.getId());

        response.setProductId(wishlist.getProduct().getId());

        response.setProductName(wishlist.getProduct().getName());

        response.setPrice(wishlist.getProduct().getPrice());

        response.setStatus(wishlist.getProduct().getStatus().name());

        response.setImageUrls(
                wishlist.getProduct()
                        .getImages()
                        .stream()
                        .map(image -> image.getImageUrl())
                        .collect(Collectors.toList())
        );

        return response;
    }
}