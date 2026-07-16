package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.request.OrderRequest;
import com.adil.jkrjewellers.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse placeOrder(String email, OrderRequest request);

    List<OrderResponse> getMyOrders(String email);

    OrderResponse getOrderById(String email, Long orderId);

    List<OrderResponse> getAllOrders();

}