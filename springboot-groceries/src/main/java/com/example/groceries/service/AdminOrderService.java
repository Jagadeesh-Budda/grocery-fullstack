package com.example.groceries.service;

import com.example.groceries.controller.dto.AdminOrderDetailDTO;
import com.example.groceries.controller.dto.AdminOrderItemDTO;
import com.example.groceries.controller.dto.AdminOrderSummaryDTO;
import com.example.groceries.controller.dto.AdminOrderTimelineEntryDTO;
import com.example.groceries.model.Order;
import com.example.groceries.model.OrderItem;
import com.example.groceries.model.OrderStatus;
import com.example.groceries.repository.AdminOrderSummaryProjection;
import com.example.groceries.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public Page<AdminOrderSummaryDTO> listOrders(int page, int size, OrderStatus status, String q) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), 200),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Long orderId = parseOrderId(q);
        String email = (orderId == null) ? normalizeSearch(q) : null;

        Page<AdminOrderSummaryProjection> rows = orderRepository.findAdminOrderSummaries(status, orderId, email, pageable);
        return rows.map(this::toSummary);
    }

    @Transactional
    public AdminOrderDetailDTO getOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        List<OrderItem> items = order.getOrderItems() == null ? List.of() : order.getOrderItems();
        List<AdminOrderItemDTO> itemDTOs = items.stream()
                .map(this::toItem)
                .toList();

        return new AdminOrderDetailDTO(
                order.getId(),
                order.getUser() == null ? null : order.getUser().getEmail(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                items.size(),
                buildTimeline(order.getStatus()),
                itemDTOs
        );
    }

    private AdminOrderSummaryDTO toSummary(AdminOrderSummaryProjection row) {
        long itemsCount = row.getItemsCount() == null ? 0L : row.getItemsCount();
        return new AdminOrderSummaryDTO(
                row.getOrderId(),
                row.getUserEmail(),
                row.getTotalAmount(),
                row.getStatus(),
                row.getCreatedAt(),
                itemsCount,
                buildTimeline(row.getStatus())
        );
    }

    private AdminOrderItemDTO toItem(OrderItem item) {
        return new AdminOrderItemDTO(
                item.getId(),
                item.getProductName(),
                item.getVariantName(),
                item.getQuantity(),
                item.getPrice(),
                item.getSubtotal()
        );
    }

    private static Long parseOrderId(String q) {
        if (q == null) {
            return null;
        }
        String trimmed = q.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        try {
            return Long.parseLong(trimmed);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private static String normalizeSearch(String q) {
        if (q == null) {
            return null;
        }
        String trimmed = q.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static List<AdminOrderTimelineEntryDTO> buildTimeline(OrderStatus current) {
        if (current == null) {
            return List.of();
        }

        // Deterministic timeline derived from current status (no extra persistence needed).
        List<OrderStatus> flow = List.of(
                OrderStatus.CREATED,
                OrderStatus.PENDING,
                OrderStatus.CONFIRMED,
                OrderStatus.PACKED,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.CANCELLED
        );

        if (current == OrderStatus.CANCELLED) {
            List<AdminOrderTimelineEntryDTO> cancelled = new ArrayList<>();
            cancelled.add(new AdminOrderTimelineEntryDTO(OrderStatus.CREATED, true, false));
            cancelled.add(new AdminOrderTimelineEntryDTO(OrderStatus.CANCELLED, true, true));
            return cancelled;
        }

        int currentIndex = flow.indexOf(current);
        if (currentIndex < 0) {
            return List.of(new AdminOrderTimelineEntryDTO(current, true, true));
        }

        List<AdminOrderTimelineEntryDTO> entries = new ArrayList<>();
        for (int i = 0; i < flow.size() - 1; i++) { // exclude CANCELLED from normal flow
            OrderStatus status = flow.get(i);
            boolean reached = i <= currentIndex;
            boolean isCurrent = status == current;
            entries.add(new AdminOrderTimelineEntryDTO(status, reached, isCurrent));
        }
        return entries;
    }
}
