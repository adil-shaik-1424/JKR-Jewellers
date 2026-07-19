package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.response.HeroBannerResponse;
import com.adil.jkrjewellers.entity.HeroBanner;
import com.adil.jkrjewellers.repository.HeroBannerRepository;
import com.adil.jkrjewellers.util.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/banners")
public class AdminHeroBannerController {

    private final FileStorageService fileStorageService;
    private final HeroBannerRepository heroBannerRepository;

    public AdminHeroBannerController(
            FileStorageService fileStorageService,
            HeroBannerRepository heroBannerRepository) {

        this.fileStorageService = fileStorageService;
        this.heroBannerRepository = heroBannerRepository;
    }

    @GetMapping
    public ResponseEntity<List<HeroBannerResponse>> getAllBanners() {

        List<HeroBannerResponse> response =
                heroBannerRepository.findAllByOrderByPositionAsc()
                        .stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{position}")
    public ResponseEntity<HeroBannerResponse> uploadBanner(
            @PathVariable Integer position,
            @RequestParam("file") MultipartFile file) {

        try {

            // saveFile now uploads to Cloudinary and returns the full secure URL directly
            String imageUrl = fileStorageService.saveFile(file);

            HeroBanner banner = heroBannerRepository
                    .findByPosition(position)
                    .orElse(new HeroBanner());

            if (banner.getImageUrl() != null) {

                try {
                    fileStorageService.deleteFile(banner.getImageUrl());
                } catch (IOException ignored) {
                }
            }

            banner.setPosition(position);
            banner.setImageUrl(imageUrl);

            HeroBanner saved = heroBannerRepository.save(banner);

            return ResponseEntity.ok(mapToResponse(saved));

        } catch (IOException e) {

            throw new RuntimeException("Unable to upload banner image", e);
        }
    }

    @DeleteMapping("/{position}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Integer position) {

        HeroBanner banner = heroBannerRepository
                .findByPosition(position)
                .orElseThrow(() -> new RuntimeException("Banner not found"));

        try {

            fileStorageService.deleteFile(banner.getImageUrl());

        } catch (IOException e) {

            throw new RuntimeException("Unable to delete banner image", e);
        }

        heroBannerRepository.delete(banner);

        return ResponseEntity.noContent().build();
    }

    private HeroBannerResponse mapToResponse(HeroBanner banner) {

        HeroBannerResponse response = new HeroBannerResponse();
        response.setId(banner.getId());
        response.setPosition(banner.getPosition());
        response.setImageUrl(banner.getImageUrl());

        return response;
    }
}