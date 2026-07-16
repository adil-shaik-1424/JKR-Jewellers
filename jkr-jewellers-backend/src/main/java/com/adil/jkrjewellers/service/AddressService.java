package com.adil.jkrjewellers.service;

import com.adil.jkrjewellers.dto.request.AddressRequest;
import com.adil.jkrjewellers.dto.response.AddressResponse;

import java.util.List;

public interface AddressService {
    AddressResponse addAddress(String email, AddressRequest request);
    List<AddressResponse> getAddresses(String email);
    void deleteAddress(String email, Long addressId);
}