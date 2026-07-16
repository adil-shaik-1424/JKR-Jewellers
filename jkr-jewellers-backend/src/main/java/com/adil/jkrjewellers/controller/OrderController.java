package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.request.OrderRequest;
import com.adil.jkrjewellers.dto.response.OrderResponse;
import com.adil.jkrjewellers.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(Authentication authentication,
                                                       @RequestBody OrderRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.placeOrder(email, request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getMyOrders(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(Authentication authentication,
                                                        @PathVariable Long id) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getOrderById(email, id));
    }

}