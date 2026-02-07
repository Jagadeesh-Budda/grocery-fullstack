package com.example.groceries.service;

import com.example.groceries.model.AuditLog;
import com.example.groceries.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void record(
            String actorUsername,
            Long actorUserId,
            String entity,
            String entityId,
            String beforeJson,
            String afterJson
    ) {
        if (entity == null || entity.isBlank()) {
            throw new IllegalArgumentException("entity is required");
        }
        if (entityId == null || entityId.isBlank()) {
            throw new IllegalArgumentException("entityId is required");
        }

        AuditLog log = new AuditLog();
        log.setActorUsername(actorUsername);
        log.setActorUserId(actorUserId);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setBeforeJson(beforeJson);
        log.setAfterJson(afterJson);

        auditLogRepository.save(log);
    }
}
