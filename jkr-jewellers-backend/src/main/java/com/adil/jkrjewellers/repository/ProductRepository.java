package com.adil.jkrjewellers.repository;

import com.adil.jkrjewellers.entity.Product;
import com.adil.jkrjewellers.entity.enums.Gender;
import com.adil.jkrjewellers.entity.enums.MetalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Products by Category
    List<Product> findByCategoryId(Long categoryId);

    // Check if category has products
    boolean existsByCategoryId(Long categoryId);

    // Best Sellers
    List<Product> findByIsBestSellerTrue();

    // Search Products
    List<Product> findByNameContainingIgnoreCaseOrCategory_NameContainingIgnoreCase(
            String productName,
            String categoryName
    );

    // Products by Gender & Metal
    List<Product> findByCategoryGenderAndCategoryMetalType(
            Gender gender,
            MetalType metalType
    );

    // Products by Gender, Metal & Category
    List<Product> findByCategoryGenderAndCategoryMetalTypeAndCategoryId(
            Gender gender,
            MetalType metalType,
            Long categoryId
    );

    // Universal Filter
    @Query("""
        SELECT p FROM Product p
        WHERE
        (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:purity IS NULL OR p.purity = :purity)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
    """)
    List<Product> filterProducts(
            @Param("categoryId") Long categoryId,
            @Param("purity") String purity,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );

}