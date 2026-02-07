package com.example.groceries.service;

import com.example.groceries.model.Category;
import com.example.groceries.repository.CategoryRepository;
import com.example.groceries.audit.AdminAuditMutation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @AdminAuditMutation(
            entity = "Category",
            entityClass = Category.class,
            entityIdBefore = "#category.id",
            entityIdAfter = "#result.id",
            operation = AdminAuditMutation.Operation.UPDATE
    )
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    @AdminAuditMutation(
            entity = "Category",
            entityClass = Category.class,
            entityIdBefore = "#id",
            entityIdAfter = "#id",
            operation = AdminAuditMutation.Operation.DELETE
    )
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
