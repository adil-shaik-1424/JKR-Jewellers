package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.response.ProductImageResponse;
import com.adil.jkrjewellers.entity.Product;
import com.adil.jkrjewellers.entity.ProductImage;
import com.adil.jkrjewellers.repository.ProductImageRepository;
import com.adil.jkrjewellers.repository.ProductRepository;
import com.adil.jkrjewellers.util.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
public class ImageUploadController {

    private final FileStorageService fileStorageService;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public ImageUploadController(
            FileStorageService fileStorageService,
            ProductRepository productRepository,
            ProductImageRepository productImageRepository) {

        this.fileStorageService = fileStorageService;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }

    @PostMapping("/{productId}/images")
    public ResponseEntity<List<ProductImageResponse>> uploadImages(

            @PathVariable Long productId,

            @RequestParam("files") List<MultipartFile> files

    ) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int displayOrder =
                productImageRepository
                        .findByProductIdOrderByDisplayOrderAsc(productId)
                        .size();

        List<ProductImageResponse> response = new ArrayList<>();

        for (MultipartFile file : files) {

            try {

                // saveFile now uploads to Cloudinary and returns the full secure URL
                String imageUrl = fileStorageService.saveFile(file);

                ProductImage image = new ProductImage();

                image.setProduct(product);
                image.setImageUrl(imageUrl);
                image.setPrimary(displayOrder == 0);
                image.setDisplayOrder(displayOrder++);

                ProductImage saved =
                        productImageRepository.save(image);

                ProductImageResponse dto =
                        new ProductImageResponse();

                dto.setId(saved.getId());
                dto.setImageUrl(saved.getImageUrl());
                dto.setPrimary(saved.isPrimary());
                dto.setDisplayOrder(saved.getDisplayOrder());

                response.add(dto);

            } catch (IOException e) {

                throw new RuntimeException(
                        "Unable to upload image",
                        e
                );

            }

        }

        return ResponseEntity.ok(response);

    }

    @DeleteMapping("/{productId}/images/{imageId}")
    public ResponseEntity<Map<String, String>> deleteImage(

            @PathVariable Long productId,

            @PathVariable Long imageId

    ) {

        ProductImage image =
                productImageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new RuntimeException("Image not found"));

        if (!image.getProduct().getId().equals(productId)) {

            throw new RuntimeException(
                    "Image does not belong to this product");

        }

        try {

            // Cloudinary needs the full stored URL to figure out what to delete
            fileStorageService.deleteFile(image.getImageUrl());

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to delete image",
                    e);

        }

        productImageRepository.delete(image);

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Image deleted successfully");

        return ResponseEntity.ok(response);

    }

}