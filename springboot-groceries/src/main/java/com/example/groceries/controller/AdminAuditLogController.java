package com.example.groceries.controller;

import com.example.groceries.controller.dto.audit.AdminAuditLogDTO;
import com.example.groceries.service.AdminAuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
public class AdminAuditLogController {

    private final AdminAuditLogService adminAuditLogService;

    @GetMapping
    public ResponseEntity<Page<AdminAuditLogDTO>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String entity,
            @RequestParam(required = false) String entityId,
            @RequestParam(required = false) String actor,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Authentication authentication
    ) {
        int safeSize = Math.min(Math.max(size, 1), 200);
        PageRequest pageable = PageRequest.of(Math.max(page, 0), safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<AdminAuditLogDTO> result = adminAuditLogService.list(entity, entityId, actor, from, to, pageable);

        log.info(
                "AUDIT admin_audit_logs_list admin={} page={} size={} entity={} entityId={} actor={} from={} to={} count={} ",
                authentication != null ? authentication.getName() : "anonymous",
                page,
                safeSize,
                entity,
                entityId,
                actor,
                from,
                to,
                result.getNumberOfElements()
        );

        return ResponseEntity.ok(result);
    }
}
