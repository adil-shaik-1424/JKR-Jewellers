package com.adil.jkrjewellers.repository;

import com.adil.jkrjewellers.entity.HeroBanner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HeroBannerRepository extends JpaRepository<HeroBanner, Long> {

    Optional<HeroBanner> findByPosition(Integer position);

    List<HeroBanner> findAllByOrderByPositionAsc();
}