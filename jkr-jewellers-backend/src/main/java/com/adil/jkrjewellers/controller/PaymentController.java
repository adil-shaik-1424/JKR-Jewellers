package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.request.PaymentRequest;
import com.adil.jkrjewellers.dto.request.PaymentVerifyRequest;
import com.adil.jkrjewellers.dto.response.PaymentResponse;
import com.adil.jkrjewellers.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPaymentOrder(
            Authentication authentication,
            @RequestBody PaymentRequest request) {

        String email = authentication.getName();

        return ResponseEntity.ok(paymentService.createPaymentOrder(email, request));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

}