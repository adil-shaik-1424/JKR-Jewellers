package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.request.ProductRequest;
import com.adil.jkrjewellers.dto.response.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    ProductResponse addProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();

    List<ProductResponse> getProductsByCategory(Long categoryId);

    List<ProductResponse> getBestSellers();

    List<ProductResponse> searchProducts(String keyword);

    List<ProductResponse> filterProducts(
            Long categoryId,
            String purity,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );
}