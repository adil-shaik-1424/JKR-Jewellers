package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.response.HeroBannerResponse;
import com.adil.jkrjewellers.repository.HeroBannerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final HeroBannerRepository heroBannerRepository;

    public BannerController(HeroBannerRepository heroBannerRepository) {
        this.heroBannerRepository = heroBannerRepository;
    }

    @GetMapping
    public ResponseEntity<List<HeroBannerResponse>> getBanners() {

        List<HeroBannerResponse> response =
                heroBannerRepository.findAllByOrderByPositionAsc()
                        .stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private HeroBannerResponse mapToResponse(
            com.adil.jkrjewellers.entity.HeroBanner banner) {

        HeroBannerResponse dto = new HeroBannerResponse();
        dto.setId(banner.getId());
        dto.setPosition(banner.getPosition());
        dto.setImageUrl(banner.getImageUrl());

        return dto;
    }
}