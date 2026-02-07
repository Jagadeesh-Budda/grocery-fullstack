package com.example.groceries.service;

import com.example.groceries.controller.dto.store.AdminStoreDTO;
import com.example.groceries.model.Store;
import com.example.groceries.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStoreService {

    private final StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<AdminStoreDTO> listStores() {
        return storeRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminStoreDTO getStore(long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + storeId));
        return toDto(store);
    }

    private AdminStoreDTO toDto(Store store) {
        return new AdminStoreDTO(
                store.getId(),
                store.getCode(),
                store.getName(),
                store.getIs_active()
        );
    }
}
