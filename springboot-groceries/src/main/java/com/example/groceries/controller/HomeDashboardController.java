package com.example.groceries.controller;

import com.example.groceries.controller.dto.dashboard.HomeDashboardDTO;
import com.example.groceries.security.UserPrincipal;
import com.example.groceries.service.HomeDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Thin REST controller exposing the Home Dashboard read model.
 *
 * This controller intentionally does not contain any business logic.
 */
@RestController
public class HomeDashboardController {

    private final HomeDashboardService homeDashboardService;

    public HomeDashboardController(HomeDashboardService homeDashboardService) {
        this.homeDashboardService = homeDashboardService;
    }

    @GetMapping("/api/home-dashboard")
    public ResponseEntity<HomeDashboardDTO> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal.getId();
        return ResponseEntity.ok(homeDashboardService.getDashboard(userId));
    }
}
