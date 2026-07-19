package com.adil.jkrjewellers.service.impl;

import com.adil.jkrjewellers.dto.request.ProductRequest;
import com.adil.jkrjewellers.dto.response.ProductResponse;
import com.adil.jkrjewellers.dto.response.ProductImageResponse;
import com.adil.jkrjewellers.entity.Category;
import com.adil.jkrjewellers.entity.Product;
import com.adil.jkrjewellers.entity.ProductImage;
import com.adil.jkrjewellers.entity.enums.ProductStatus;
import com.adil.jkrjewellers.exception.ResourceNotFoundException;
import com.adil.jkrjewellers.repository.CartItemRepository;
import com.adil.jkrjewellers.repository.CategoryRepository;
import com.adil.jkrjewellers.repository.ProductImageRepository;
import com.adil.jkrjewellers.repository.ProductRepository;
import com.adil.jkrjewellers.repository.WishlistRepository;
import com.adil.jkrjewellers.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistRepository wishlistRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductImageRepository productImageRepository,
            CartItemRepository cartItemRepository,
            WishlistRepository wishlistRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.cartItemRepository = cartItemRepository;
        this.wishlistRepository = wishlistRepository;
    }

    @Override
    public ProductResponse addProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        Product product = new Product();

        product.setCategory(category);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setWeight(request.getWeight());
        product.setPurity(request.getPurity());
        product.setStockQuantity(request.getStockQuantity());
        product.setStatus(ProductStatus.AVAILABLE);
        product.setBestSeller(request.isBestSeller());

        Product saved = productRepository.save(product);

        return mapToResponse(saved, List.of());
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        product.setCategory(category);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setWeight(request.getWeight());
        product.setPurity(request.getPurity());
        product.setStockQuantity(request.getStockQuantity());
        product.setBestSeller(request.isBestSeller());
        product.setStatus(request.getStatus());

        Product updated = productRepository.save(product);

        return getProductById(updated.getId());
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Product not found with id: " + id);
        }

        cartItemRepository.deleteByProductId(id);
        wishlistRepository.deleteByProductId(id);

        productRepository.deleteById(id);
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));

        List<ProductImageResponse> images = productImageRepository
                .findByProductIdOrderByDisplayOrderAsc(product.getId())
                .stream()
                .map(this::mapImage)
                .collect(Collectors.toList());

        return mapToResponse(product, images);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return mapToResponseList(productRepository.findAll());
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return mapToResponseList(productRepository.findByCategoryId(categoryId));
    }

    @Override
    public List<ProductResponse> getBestSellers() {
        return mapToResponseList(productRepository.findByIsBestSellerTrue());
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        return mapToResponseList(
                productRepository
                        .findByNameContainingIgnoreCaseOrCategory_NameContainingIgnoreCase(
                                keyword,
                                keyword
                        )
        );
    }

    @Override
    public List<ProductResponse> filterProducts(
            Long categoryId,
            String purity,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        return mapToResponseList(
                productRepository.filterProducts(
                        categoryId,
                        purity,
                        minPrice,
                        maxPrice
                )
        );
    }

    // Batches image lookups into ONE query for the whole list instead of one query per product
    private List<ProductResponse> mapToResponseList(List<Product> products) {

        if (products.isEmpty()) {
            return List.of();
        }

        List<Long> productIds = products.stream()
                .map(Product::getId)
                .collect(Collectors.toList());

        Map<Long, List<ProductImageResponse>> imagesByProduct = productImageRepository
                .findByProductIdInOrderByDisplayOrderAsc(productIds)
                .stream()
                .collect(Collectors.groupingBy(
                        img -> img.getProduct().getId(),
                        Collectors.mapping(this::mapImage, Collectors.toList())
                ));

        return products.stream()
                .map(product -> mapToResponse(
                        product,
                        imagesByProduct.getOrDefault(product.getId(), List.of())
                ))
                .collect(Collectors.toList());
    }

    private ProductImageResponse mapImage(ProductImage image) {

        ProductImageResponse img = new ProductImageResponse();

        img.setId(image.getId());
        img.setImageUrl(image.getImageUrl());
        img.setPrimary(image.isPrimary());
        img.setDisplayOrder(image.getDisplayOrder());

        return img;
    }

    private ProductResponse mapToResponse(Product product, List<ProductImageResponse> images) {

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setWeight(product.getWeight());
        response.setPurity(product.getPurity());
        response.setStockQuantity(product.getStockQuantity());
        response.setStatus(product.getStatus().name());
        response.setBestSeller(product.isBestSeller());
        response.setCategoryName(product.getCategory().getName());
        response.setImages(images);

        return response;
    }
}