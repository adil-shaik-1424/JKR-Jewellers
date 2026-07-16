package com.adil.jkrjewellers.service.impl;

import com.adil.jkrjewellers.dto.request.CartItemRequest;
import com.adil.jkrjewellers.dto.response.CartItemResponse;
import com.adil.jkrjewellers.dto.response.CartResponse;
import com.adil.jkrjewellers.entity.Cart;
import com.adil.jkrjewellers.entity.CartItem;
import com.adil.jkrjewellers.entity.Product;
import com.adil.jkrjewellers.entity.ProductImage;
import com.adil.jkrjewellers.entity.User;
import com.adil.jkrjewellers.exception.ResourceNotFoundException;
import com.adil.jkrjewellers.repository.CartItemRepository;
import com.adil.jkrjewellers.repository.CartRepository;
import com.adil.jkrjewellers.repository.ProductImageRepository;
import com.adil.jkrjewellers.repository.ProductRepository;
import com.adil.jkrjewellers.repository.UserRepository;
import com.adil.jkrjewellers.service.CartService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;

    public CartServiceImpl(CartRepository cartRepository,
                            CartItemRepository cartItemRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository,
                            ProductImageRepository productImageRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productImageRepository = productImageRepository;
    }

    @Override
    public CartResponse getCart(String email) {
        Cart cart = getOrCreateCart(email);
        return mapToResponse(cart);
    }

    @Override
    public CartResponse addToCart(String email, CartItemRequest request) {
        Cart cart = getOrCreateCart(email);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        CartItem existingItem = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }

        return mapToResponse(cart);
    }

    @Override
    public CartResponse updateCartItem(String email, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart(email);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item not found with id: " + cartItemId);
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return mapToResponse(cart);
    }

    @Override
    public void removeCartItem(String email, Long cartItemId) {
        Cart cart = getOrCreateCart(email);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item not found with id: " + cartItemId);
        }

        cartItemRepository.deleteById(cartItemId);
    }

    private Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            CartItemResponse res = new CartItemResponse();
            res.setCartItemId(item.getId());
            res.setProductId(item.getProduct().getId());
            res.setProductName(item.getProduct().getName());
            res.setPrice(item.getProduct().getPrice());
            res.setQuantity(item.getQuantity());
            res.setSubtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            res.setStatus(item.getProduct().getStatus().name());

            // Add image URLs
            List<String> imageUrls = productImageRepository
                .findByProductIdOrderByDisplayOrderAsc(item.getProduct().getId())
                .stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
            res.setImageUrls(imageUrls);

            return res;
        }).collect(Collectors.toList());

        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartResponse response = new CartResponse();
        response.setCartId(cart.getId());
        response.setItems(itemResponses);
        response.setTotalAmount(total);

        return response;
    }
}