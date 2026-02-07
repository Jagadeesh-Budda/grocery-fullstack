package com.example.groceries.service;

import com.example.groceries.controller.dto.audit.AdminAuditLogDTO;
import com.example.groceries.model.AuditLog;
import com.example.groceries.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminAuditLogService {

    private final AuditLogRepository auditLogRepository;

    public Page<AdminAuditLogDTO> list(
            String entity,
            String entityId,
            String actor,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable
    ) {
        Specification<AuditLog> spec = Specification.where(null);

        if (entity != null && !entity.isBlank()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("entity"), entity));
        }
        if (entityId != null && !entityId.isBlank()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("entityId"), entityId));
        }
        if (actor != null && !actor.isBlank()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("actorUsername"), actor));
        }
        if (from != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), from));
        }
        if (to != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), to));
        }

        return auditLogRepository.findAll(spec, pageable)
                .map(this::toDto);
    }

    private AdminAuditLogDTO toDto(AuditLog l) {
        return new AdminAuditLogDTO(
                l.getId(),
                l.getCreatedAt(),
                l.getActorUsername(),
                l.getActorUserId(),
                l.getEntity(),
                l.getEntityId(),
                l.getBeforeJson(),
                l.getAfterJson()
        );
    }
}
