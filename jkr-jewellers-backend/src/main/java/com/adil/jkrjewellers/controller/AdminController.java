package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.response.AdminCustomerDetailsResponse;
import com.adil.jkrjewellers.dto.response.AdminCustomerResponse;
import com.adil.jkrjewellers.dto.response.AdminOrderDetailsResponse;
import com.adil.jkrjewellers.dto.response.AdminOrderResponse;
import com.adil.jkrjewellers.dto.response.DashboardResponse;
import com.adil.jkrjewellers.service.AdminService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ================= DASHBOARD =================

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                adminService.getDashboardStats()
        );

    }

    // ================= CUSTOMERS =================

    @GetMapping("/customers")
    public ResponseEntity<List<AdminCustomerResponse>> getCustomers() {

        return ResponseEntity.ok(
                adminService.getAllCustomers()
        );

    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<AdminCustomerDetailsResponse> getCustomer(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getCustomerById(id)
        );

    }

    // ================= ORDERS =================

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderResponse>> getOrders() {

        return ResponseEntity.ok(
                adminService.getAllOrders()
        );

    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<AdminOrderDetailsResponse> getOrder(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getOrderById(id)
        );

    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<String> updateStatus(

            @PathVariable Long id,

            @RequestParam String status) {

        adminService.updateOrderStatus(id, status);

        return ResponseEntity.ok("Order Updated Successfully");

    }

}