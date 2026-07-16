package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.request.PaymentRequest;
import com.adil.jkrjewellers.dto.request.PaymentVerifyRequest;
import com.adil.jkrjewellers.dto.response.PaymentResponse;

public interface PaymentService {

    PaymentResponse createPaymentOrder(String email, PaymentRequest request);

    PaymentResponse verifyPayment(PaymentVerifyRequest request);

}