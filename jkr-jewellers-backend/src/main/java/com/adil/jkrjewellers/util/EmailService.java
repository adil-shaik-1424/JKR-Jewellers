package com.adil.jkrjewellers.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.admin.notify.email}")
    private String adminEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Admin Notification
    public void sendOrderNotification(Long orderId, String customerEmail, String totalAmount) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(adminEmail);

        message.setSubject("New Order Received - Order #" + orderId);

        message.setText(
                "A new order has been placed.\n\n" +
                "Order ID : " + orderId + "\n" +
                "Customer : " + customerEmail + "\n" +
                "Total Amount : ₹" + totalAmount + "\n\n" +
                "Please check the admin panel for full details."
        );

        mailSender.send(message);
    }

    // Customer OTP
    public void sendOtp(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject("JKR Jewellers - Email Verification");

        message.setText(
                "Welcome to JKR Jewellers.\n\n" +
                "Your OTP for email verification is:\n\n" +
                otp +
                "\n\nThis OTP is valid for 10 minutes." +
                "\n\nDo not share this OTP with anyone." +
                "\n\nRegards,\nJKR Jewellers"
        );

        mailSender.send(message);
    }

}