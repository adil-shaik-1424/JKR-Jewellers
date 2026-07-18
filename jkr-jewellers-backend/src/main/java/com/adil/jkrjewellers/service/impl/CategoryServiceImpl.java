package com.adil.jkrjewellers.service.impl;

import com.adil.jkrjewellers.entity.Category;
import com.adil.jkrjewellers.entity.enums.Gender;
import com.adil.jkrjewellers.entity.enums.MetalType;
import com.adil.jkrjewellers.repository.CategoryRepository;
import com.adil.jkrjewellers.repository.ProductRepository;
import com.adil.jkrjewellers.service.CategoryService;
import com.adil.jkrjewellers.util.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    @Value("${app.base.url}")
    private String baseUrl;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            FileStorageService fileStorageService
    ) {

        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;

    }

    @Override
    public Category addCategory(Category category) {

        return categoryRepository.save(category);

    }

    @Override
    public Category updateCategory(Long id, Category category) {

        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setName(category.getName());
        existing.setGender(category.getGender());
        existing.setMetalType(category.getMetalType());
        existing.setDescription(category.getDescription());
        existing.setActive(category.isActive());
        existing.setFeatured(category.isFeatured());

        return categoryRepository.save(existing);

    }

    @Override
    public void deleteCategory(Long id) {

        if (productRepository.existsByCategoryId(id)) {

            throw new RuntimeException(
                    "Cannot delete category. This category contains products."
            );

        }

        categoryRepository.deleteById(id);

    }

    @Override
    public List<Category> getAllCategories() {

        return categoryRepository.findAll();

    }
    @Override
    public List<Category> getCategoriesByGenderAndMetalType(
            Gender gender,
            MetalType metalType
    ) {

        return categoryRepository.findByGenderAndMetalType(
                gender,
                metalType
        );

    }

    @Override
    public List<Category> getFeaturedCategories() {

        return categoryRepository.findByFeaturedTrue();

    }

    @Override
    public Category uploadCategoryImage(
            Long id,
            MultipartFile file
    ) throws IOException {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String fileName = fileStorageService.saveFile(file);

        category.setImageUrl(
                baseUrl + "/images/" + fileName
        );

        return categoryRepository.save(category);

    }

}