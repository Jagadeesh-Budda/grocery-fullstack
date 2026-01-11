package com.example.groceries;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;

@SpringBootApplication
public class GroceryApplication {
    public static void main(String[] args) {
        // Force the JVM to use the standardized timezone name before Spring starts
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));

        SpringApplication.run(GroceryApplication.class, args);
    }
}