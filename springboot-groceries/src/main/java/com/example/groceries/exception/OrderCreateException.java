package com.example.groceries.exception;

import lombok.Getter;

@Getter
public class OrderCreateException extends RuntimeException {

    private final OrderCreateErrorCode code;

    public OrderCreateException(OrderCreateErrorCode code, String message) {
        super(message);
        this.code = code;
    }
}
