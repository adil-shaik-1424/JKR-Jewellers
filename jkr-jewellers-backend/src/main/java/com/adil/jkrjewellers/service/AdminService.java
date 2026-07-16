package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.response.AdminCustomerDetailsResponse;
import com.adil.jkrjewellers.dto.response.AdminCustomerResponse;
import com.adil.jkrjewellers.dto.response.AdminOrderDetailsResponse;
import com.adil.jkrjewellers.dto.response.AdminOrderResponse;
import com.adil.jkrjewellers.dto.response.DashboardResponse;

import java.util.List;

public interface AdminService {

    List<AdminCustomerResponse> getAllCustomers();

    AdminCustomerDetailsResponse getCustomerById(Long customerId);

    List<AdminOrderResponse> getAllOrders();

    AdminOrderDetailsResponse getOrderById(Long orderId);

    void updateOrderStatus(Long orderId, String status);

    DashboardResponse getDashboardStats();

}