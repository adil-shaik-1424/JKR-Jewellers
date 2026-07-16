package com.adil.jkrjewellers.repository;

import com.adil.jkrjewellers.entity.Category;
import com.adil.jkrjewellers.entity.enums.Gender;
import com.adil.jkrjewellers.entity.enums.MetalType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

    public interface CategoryRepository extends JpaRepository<Category, Long> {

        List<Category> findByGenderAndMetalType(
                Gender gender,
                MetalType metalType
        );

        List<Category> findByFeaturedTrue();

    }
