package com.adil.jkrjewellers.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class EmailService {

    @Value("${app.admin.notify.email}")
    private String adminEmail;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // Admin Notification
    public void sendOrderNotification(Long orderId, String customerEmail, String totalAmount) {

        String subject = "New Order Received - Order #" + orderId;

        String text =
                "A new order has been placed.\n\n" +
                "Order ID : " + orderId + "\n" +
                "Customer : " + customerEmail + "\n" +
                "Total Amount : Rs " + totalAmount + "\n\n" +
                "Please check the admin panel for full details.";

        send(adminEmail, subject, text);
    }

    // Customer OTP
    public void sendOtp(String email, String otp) {

        String subject = "JKR Jewellers - Email Verification";

        String text =
                "Welcome to JKR Jewellers.\n\n" +
                "Your OTP for email verification is:\n\n" +
                otp +
                "\n\nThis OTP is valid for 10 minutes." +
                "\n\nDo not share this OTP with anyone." +
                "\n\nRegards,\nJKR Jewellers";

        send(email, subject, text);
    }

    private void send(String toEmail, String subject, String textBody) {
        try {
            String escapedText = textBody
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n");

            String jsonBody = "{"
                    + "\"sender\":{\"email\":\"" + senderEmail + "\",\"name\":\"JKR Jewellers\"},"
                    + "\"to\":[{\"email\":\"" + toEmail + "\"}],"
                    + "\"subject\":\"" + subject.replace("\"", "\\\"") + "\","
                    + "\"textContent\":\"" + escapedText + "\""
                    + "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("accept", "application/json")
                    .header("api-key", brevoApiKey)
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 300) {
                throw new RuntimeException("Brevo email send failed: " + response.statusCode() + " - " + response.body());
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email via Brevo: " + e.getMessage(), e);
        }
    }

}