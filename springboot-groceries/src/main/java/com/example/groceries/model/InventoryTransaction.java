package com.example.groceries.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private InventoryTransactionType type;

    @NotNull
    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(name = "order_id")
    private Long orderId;

    @NotNull
    @Column(name = "delta", nullable = false)
    private Integer delta;

    @NotNull
    @Column(name = "stock_before", nullable = false)
    private Integer stockBefore;

    @NotNull
    @Column(name = "stock_after", nullable = false)
    private Integer stockAfter;

    @Column(name = "reason")
    private String reason;

    @Column(name = "actor_username")
    private String actorUsername;

    @Column(name = "actor_user_id")
    private Long actorUserId;
}
