package com.example.groceries.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.util.Map;

class AuditJson {

    private final ObjectMapper mapper;
    private final AuditSnapshotter snapshotter;

    AuditJson() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.snapshotter = new AuditSnapshotter();
    }

    String toJson(Object entity) {
        Map<String, Object> snap = snapshotter.snapshot(entity);
        if (snap == null) {
            return null;
        }
        try {
            return mapper.writeValueAsString(snap);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
