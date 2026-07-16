package com.adil.jkrjewellers.repository;

import com.adil.jkrjewellers.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findTop5ByOrderByCreatedAtDesc();
}