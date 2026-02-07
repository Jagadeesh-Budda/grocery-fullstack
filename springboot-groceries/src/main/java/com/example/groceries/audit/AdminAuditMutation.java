package com.example.groceries.audit;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AdminAuditMutation {

    String entity();

    Class<?> entityClass();

    /**
     * SpEL for the entity id BEFORE the mutation. Typically references method args.
     * Examples: "#productId", "#id", "#variantId", "#category.id"
     */
    String entityIdBefore() default "";

    /**
     * SpEL for the entity id AFTER the mutation. May reference "#result".
     * Examples: "#productId", "#result" (when returning created id), "#result.id".
     */
    String entityIdAfter() default "";

    Operation operation();

    enum Operation {
        CREATE,
        UPDATE,
        DELETE
    }
}
