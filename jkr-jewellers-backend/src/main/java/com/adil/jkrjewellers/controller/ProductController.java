package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.response.ProductResponse;
import com.adil.jkrjewellers.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) Long categoryId) {

        if (categoryId != null) {
            return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
        }

        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<ProductResponse>> getBestSellers() {

        return ResponseEntity.ok(
                productService.getBestSellers()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                productService.searchProducts(keyword)
        );
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponse>> filterProducts(

            @RequestParam(required = false) Long categoryId,

            @RequestParam(required = false) String purity,

            @RequestParam(required = false) BigDecimal minPrice,

            @RequestParam(required = false) BigDecimal maxPrice

    ) {

        return ResponseEntity.ok(

                productService.filterProducts(
                        categoryId,
                        purity,
                        minPrice,
                        maxPrice
                )

        );

    }

}