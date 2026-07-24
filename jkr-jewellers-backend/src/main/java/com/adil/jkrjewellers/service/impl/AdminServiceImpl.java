package com.adil.jkrjewellers.service.impl;

import com.adil.jkrjewellers.dto.response.*;
import com.adil.jkrjewellers.entity.*;
import com.adil.jkrjewellers.entity.enums.OrderStatus;
import com.adil.jkrjewellers.exception.BadRequestException;
import com.adil.jkrjewellers.exception.ResourceNotFoundException;
import com.adil.jkrjewellers.repository.*;
import com.adil.jkrjewellers.service.AdminService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public AdminServiceImpl(
            UserRepository userRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            AddressRepository addressRepository,
            PaymentRepository paymentRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressRepository = addressRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // ================= CUSTOMERS =================

    @Override
    public List<AdminCustomerResponse> getAllCustomers() {

        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole().name().equals("CUSTOMER"))
                .map(user -> {

                    List<Order> orders = orderRepository.findByUserId(user.getId());

                    AdminCustomerResponse response = new AdminCustomerResponse();

                    response.setId(user.getId());
                    response.setName(user.getName());
                    response.setEmail(user.getEmail());
                    response.setPhone(user.getPhone());

                    response.setOrdersCount((long) orders.size());

                    BigDecimal totalSpent = orders.stream()
                            .map(Order::getTotalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    response.setTotalSpent(totalSpent);

                    response.setStatus("ACTIVE");

                    return response;

                })
                .collect(Collectors.toList());
    }

    @Override
    public AdminCustomerDetailsResponse getCustomerById(Long customerId) {

        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        List<Order> orders = orderRepository.findByUserId(user.getId());
        List<Address> addresses = addressRepository.findByUserId(user.getId());

        AdminCustomerDetailsResponse response = new AdminCustomerDetailsResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setJoinedDate(user.getCreatedAt());

        response.setOrdersCount((long) orders.size());

        BigDecimal totalSpent = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        response.setTotalSpent(totalSpent);

        response.setAddresses(
                addresses.stream()
                        .map(this::mapToAddressResponse)
                        .collect(Collectors.toList())
        );

        response.setOrders(
                orders.stream()
                        .map(this::mapToOrderResponse)
                        .collect(Collectors.toList())
        );

        return response;
    }

    // ================= ORDERS =================

    @Override
    public List<AdminOrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToAdminOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminOrderDetailsResponse getOrderById(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());

        AdminOrderDetailsResponse response = new AdminOrderDetailsResponse();

        response.setOrderId(order.getId());
        response.setOrderDate(order.getCreatedAt());
        response.setTotalAmount(order.getTotalAmount());
        response.setOrderStatus(order.getStatus().name());

        User user = order.getUser();
        response.setCustomerName(user.getName());
        response.setCustomerEmail(user.getEmail());
        response.setCustomerPhone(user.getPhone());

        response.setShippingAddress(mapToAddressResponse(order.getAddress()));

        response.setProducts(
                orderItems.stream()
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList())
        );

        response.setPaymentStatus(
                paymentRepository.findByOrderId(order.getId())
                        .map(payment -> payment.getStatus().name())
                        .orElse("PENDING")
        );

        return response;
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    // ================= DASHBOARD =================

    @Override
    public DashboardResponse getDashboardStats() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalProducts(productRepository.count());
        response.setTotalCategories(categoryRepository.count());

        long customerCount = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole().name().equals("CUSTOMER"))
                .count();

        response.setTotalCustomers(customerCount);
        response.setTotalOrders(orderRepository.count());

        BigDecimal revenue = orderRepository.findAll()
                .stream()
                .filter(order -> !order.getStatus().name().equals("CANCELLED"))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        response.setRevenue(revenue);

        List<AdminOrderResponse> recentOrders = orderRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToAdminOrderResponse)
                .collect(Collectors.toList());

        response.setRecentOrders(recentOrders);

        return response;
    }

    // ================= PRIVATE MAPPERS =================

    private AddressResponse mapToAddressResponse(Address address) {

        if (address == null) {
            return null;
        }

        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setAddressLine1(address.getAddressLine1());
        response.setAddressLine2(address.getAddressLine2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setPincode(address.getPincode());
        response.setPhone(address.getPhone());

        return response;
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem orderItem) {

        OrderItemResponse response = new OrderItemResponse();
        response.setProductId(orderItem.getProduct().getId());
        response.setProductName(orderItem.getProduct().getName());
        response.setQuantity(orderItem.getQuantity());
        response.setPriceAtPurchase(orderItem.getPriceAtPurchase());

        List<ProductImage> images = orderItem.getProduct().getImages();
        if (images != null && !images.isEmpty()) {
            String imageUrl = images.stream()
                    .filter(ProductImage::isPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(images.get(0).getImageUrl());
            response.setProductImage(imageUrl);
        }

        return response;
    }

    private OrderResponse mapToOrderResponse(Order order) {

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());

        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(
                orderItems.stream()
                        .map(this::mapToOrderItemResponse)
                        .collect(Collectors.toList())
        );

        return response;
    }

    private AdminOrderResponse mapToAdminOrderResponse(Order order) {

        AdminOrderResponse response = new AdminOrderResponse();

        response.setOrderId(order.getId());
        response.setCustomerName(order.getUser().getName());
        response.setOrderDate(order.getCreatedAt());
        response.setTotalAmount(order.getTotalAmount());
        response.setOrderStatus(order.getStatus().name());

        response.setPaymentStatus(
                paymentRepository.findByOrderId(order.getId())
                        .map(payment -> payment.getStatus().name())
                        .orElse("PENDING")
        );

        return response;
    }
}