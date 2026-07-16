package com.adil.jkrjewellers.controller;

import com.adil.jkrjewellers.dto.request.AddressRequest;
import com.adil.jkrjewellers.dto.response.AddressResponse;
import com.adil.jkrjewellers.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAddresses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(addressService.getAddresses(email));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(Authentication authentication,
                                                         @RequestBody AddressRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(addressService.addAddress(email, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication,
                                                @PathVariable Long id) {
        String email = authentication.getName();
        addressService.deleteAddress(email, id);
        return ResponseEntity.noContent().build();
    }
}