package com.example.groceries.controller.dto.audit;

import java.time.LocalDateTime;

public record AdminAuditLogDTO(
        Long id,
        LocalDateTime createdAt,
        String actorUsername,
        Long actorUserId,
        String entity,
        String entityId,
        String beforeJson,
        String afterJson
) {
}
