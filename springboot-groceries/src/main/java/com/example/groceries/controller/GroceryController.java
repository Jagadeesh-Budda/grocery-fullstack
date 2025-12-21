package com.example.groceries.controller;

import com.example.groceries.model.Grocery;
import com.example.groceries.model.GroceryCategory;
import com.example.groceries.repository.GroceryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/groceries")
public class GroceryController {
    private final GroceryRepository repo;
    public GroceryController(GroceryRepository repo){this.repo=repo;}
    @GetMapping public List<Grocery> list(){return repo.findAll();}
    @GetMapping("/categories") public List<String> getCategories(){return Arrays.asList(GroceryCategory.getAllDisplayNames());}
    @GetMapping("/{id}") public ResponseEntity<Grocery> get(@PathVariable Long id){
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping public Grocery create(@RequestBody Grocery g){return repo.save(g);}
    @PutMapping("/{id}") public ResponseEntity<Grocery> update(@PathVariable Long id,@RequestBody Grocery g){
        return repo.findById(id).map(e->{e.setName(g.getName());e.setCategory(g.getCategory());e.setPrice(g.getPrice());e.setQuantity(g.getQuantity());repo.save(e);return ResponseEntity.ok(e);}).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){
        if(!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id); return ResponseEntity.noContent().build();
    }
}
