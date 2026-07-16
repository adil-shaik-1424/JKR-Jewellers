package com.adil.jkrjewellers.service.impl;

import com.adil.jkrjewellers.dto.request.AddressRequest;
import com.adil.jkrjewellers.dto.response.AddressResponse;
import com.adil.jkrjewellers.entity.Address;
import com.adil.jkrjewellers.entity.User;
import com.adil.jkrjewellers.repository.AddressRepository;
import com.adil.jkrjewellers.repository.UserRepository;
import com.adil.jkrjewellers.service.AddressService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AddressResponse addAddress(String email, AddressRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();
        address.setUser(user);
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setPhone(request.getPhone());

        Address saved = addressRepository.save(address);
        return mapToResponse(saved);
    }

    @Override
    public List<AddressResponse> getAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAddress(String email, Long addressId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this address");
        }

        try {

            addressRepository.delete(address);

        } catch (DataIntegrityViolationException e) {

            throw new RuntimeException(
                "This address is linked to an existing order and cannot be deleted."
            );

        }
    }

    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setAddressLine1(address.getAddressLine1());
        response.setAddressLine2(address.getAddressLine2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setPincode(address.getPincode());
        response.setPhone(address.getPhone());
        return response;
    }
}