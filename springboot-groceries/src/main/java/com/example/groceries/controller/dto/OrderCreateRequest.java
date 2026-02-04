package com.example.groceries.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    /**
     * Assumption (until auth/session is wired): frontend sends the current user's id.
     * Later this should be derived from the session/auth principal instead of request body.
     */
    private Long userId;
}
