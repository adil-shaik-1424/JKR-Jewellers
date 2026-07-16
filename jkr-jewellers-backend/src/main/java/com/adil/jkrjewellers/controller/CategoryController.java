package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.entity.Category;
import com.adil.jkrjewellers.entity.enums.Gender;
import com.adil.jkrjewellers.entity.enums.MetalType;
import com.adil.jkrjewellers.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getCategories(
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) MetalType metalType) {

        if (gender != null && metalType != null) {
            return ResponseEntity.ok(
                    categoryService.getCategoriesByGenderAndMetalType(
                            gender,
                            metalType
                    )
            );
        }

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );

    }

    @GetMapping("/featured")
    public ResponseEntity<List<Category>> getFeaturedCategories() {

        return ResponseEntity.ok(
                categoryService.getFeaturedCategories()
        );

    }

    @PostMapping
    public ResponseEntity<Category> addCategory(
            @RequestBody Category category) {

        return ResponseEntity.ok(
                categoryService.addCategory(category)
        );

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();

    }

}