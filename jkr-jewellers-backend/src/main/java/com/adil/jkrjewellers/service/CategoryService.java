package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.entity.Category;
import com.adil.jkrjewellers.entity.enums.Gender;
import com.adil.jkrjewellers.entity.enums.MetalType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CategoryService {
	List<Category> getFeaturedCategories();
    Category addCategory(Category category);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);

    List<Category> getAllCategories();

    List<Category> getCategoriesByGenderAndMetalType(
            Gender gender,
            MetalType metalType
    );

    Category uploadCategoryImage(
            Long id,
            MultipartFile file
    ) throws IOException;

}