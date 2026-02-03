package com.example.groceries.controller;

import com.example.groceries.controller.dto.dashboard.HomeDashboardDTO;
import com.example.groceries.security.UserPrincipal;
import com.example.groceries.service.HomeDashboardService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HomeDashboardController.class)
@AutoConfigureMockMvc(addFilters = false)
class HomeDashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HomeDashboardService homeDashboardService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getDashboard_returns200_andContainsExpectedKeys() throws Exception {
        HomeDashboardDTO dto = new HomeDashboardDTO(List.of(), List.of(), List.of());
        when(homeDashboardService.getDashboard(1L)).thenReturn(dto);

        UserPrincipal principal = new UserPrincipal(1L, "testuser", "password", List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities())
        );

        mockMvc.perform(get("/api/home-dashboard")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.monthlyStock").exists())
                .andExpect(jsonPath("$.buyAgain").exists())
                .andExpect(jsonPath("$.lowStock").exists());
    }
}
