package com.adil.jkrjewellers.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {

    private long totalProducts;
    private long totalCategories;
    private long totalCustomers;
    private long totalOrders;
    private BigDecimal revenue;
    private List<AdminOrderResponse> recentOrders;

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalCategories() { return totalCategories; }
    public void setTotalCategories(long totalCategories) { this.totalCategories = totalCategories; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public List<AdminOrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<AdminOrderResponse> recentOrders) { this.recentOrders = recentOrders; }
}