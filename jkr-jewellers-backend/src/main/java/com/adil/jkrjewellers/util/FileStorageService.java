package com.adil.jkrjewellers.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class FileStorageService {

    private Cloudinary cloudinary;

    @Value("${cloudinary.cloud.name}")
    private String cloudName;

    @Value("${cloudinary.api.key}")
    private String apiKey;

    @Value("${cloudinary.api.secret}")
    private String apiSecret;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private Cloudinary getCloudinary() {
        if (cloudinary == null) {
            cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
        }
        return cloudinary;
    }

    // Returns the full Cloudinary secure URL (this is now what gets stored as imageUrl)
    public String saveFile(MultipartFile file) throws IOException {

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPG, PNG, and WEBP images are allowed.");
        }

        Map uploadResult = getCloudinary().uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "jkr-jewellers")
        );

        return (String) uploadResult.get("secure_url");
    }

    // Accepts the full stored imageUrl, extracts the public_id, deletes from Cloudinary
    public void deleteFile(String imageUrl) throws IOException {

        String publicId = extractPublicId(imageUrl);

        if (publicId != null) {
            getCloudinary().uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    private String extractPublicId(String imageUrl) {

        // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123456/jkr-jewellers/abc123.jpg
        // public_id = jkr-jewellers/abc123
        try {
            String afterUpload = imageUrl.substring(imageUrl.indexOf("/upload/") + 8);
            afterUpload = afterUpload.replaceFirst("^v[0-9]+/", "");
            int dotIndex = afterUpload.lastIndexOf(".");
            return dotIndex > -1 ? afterUpload.substring(0, dotIndex) : afterUpload;
        } catch (Exception e) {
            return null;
        }
    }
}