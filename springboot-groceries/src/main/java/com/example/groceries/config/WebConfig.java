package com.example.groceries.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This maps the URL localhost:8080/images/ to the actual folder
        // Use "file:./images/" if your folder is in the project root
        // Use "classpath:/static/images/" if it's inside src/main/resources/static/images
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("classpath:/static/images/");
    }
}