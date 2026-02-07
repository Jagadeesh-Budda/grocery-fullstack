package com.example.groceries.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "actor_username")
    private String actorUsername;

    @Column(name = "actor_user_id")
    private Long actorUserId;

    @Column(name = "entity", nullable = false, length = 100)
    private String entity;

    @Column(name = "entity_id", nullable = false, length = 64)
    private String entityId;

    @Column(name = "before_json", length = 100000)
    private String beforeJson;

    @Column(name = "after_json", length = 100000)
    private String afterJson;
}
