package com.adil.jkrjewellers.service.impl;

import com.adil.jkrjewellers.dto.request.PaymentRequest;
import com.adil.jkrjewellers.dto.request.PaymentVerifyRequest;
import com.adil.jkrjewellers.dto.response.PaymentResponse;
import com.adil.jkrjewellers.entity.Order;
import com.adil.jkrjewellers.entity.OrderItem;
import com.adil.jkrjewellers.entity.Payment;
import com.adil.jkrjewellers.entity.Product;
import com.adil.jkrjewellers.entity.enums.OrderStatus;
import com.adil.jkrjewellers.entity.enums.PaymentStatus;
import com.adil.jkrjewellers.entity.enums.ProductStatus;
import com.adil.jkrjewellers.repository.OrderItemRepository;
import com.adil.jkrjewellers.repository.OrderRepository;
import com.adil.jkrjewellers.repository.PaymentRepository;
import com.adil.jkrjewellers.repository.ProductRepository;
import com.adil.jkrjewellers.service.PaymentService;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public PaymentServiceImpl(RazorpayClient razorpayClient,
                               OrderRepository orderRepository,
                               PaymentRepository paymentRepository,
                               OrderItemRepository orderItemRepository,
                               ProductRepository productRepository) {
        this.razorpayClient = razorpayClient;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @Override
    public PaymentResponse createPaymentOrder(String email, PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Order not found");
        }

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + order.getId());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setRazorpayOrderId(razorpayOrder.get("id"));
            payment.setStatus(PaymentStatus.CREATED);
            payment.setAmount(order.getTotalAmount());
            Payment savedPayment = paymentRepository.save(payment);

            PaymentResponse response = new PaymentResponse();
            response.setPaymentId(savedPayment.getId());
            response.setRazorpayOrderId(razorpayOrder.get("id"));
            response.setStatus("CREATED");
            response.setAmount(order.getTotalAmount().toString());
            response.setCurrency("INR");
            return response;

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    @Override
    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        try {
            String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            String generatedSignature = hmacSha256(data, keySecret);

            Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            if (generatedSignature.equals(request.getRazorpaySignature())) {
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature(request.getRazorpaySignature());
                payment.setStatus(PaymentStatus.SUCCESS);
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                order.setStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);

                reduceStockForOrder(order);

                PaymentResponse response = new PaymentResponse();
                response.setPaymentId(payment.getId());
                response.setRazorpayOrderId(request.getRazorpayOrderId());
                response.setStatus("SUCCESS");
                response.setAmount(payment.getAmount().toString());
                response.setCurrency("INR");
                return response;

            } else {
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
                throw new RuntimeException("Payment verification failed: invalid signature");
            }

        } catch (Exception e) {
            throw new RuntimeException("Payment verification error: " + e.getMessage());
        }
    }

    private void reduceStockForOrder(Order order) {

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        for (OrderItem item : items) {

            Product product = item.getProduct();

            int remaining = product.getStockQuantity() - item.getQuantity();

            if (remaining < 0) {
                remaining = 0;
            }

            product.setStockQuantity(remaining);

            if (remaining == 0) {
                product.setStatus(ProductStatus.OUT_OF_STOCK);
            }

            productRepository.save(product);
        }
    }

    private String hmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}