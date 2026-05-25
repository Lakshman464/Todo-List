package com.todo.controller;

import com.todo.model.Todo;
import com.todo.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    private final TodoService todoService;

    @GetMapping("/projects/{projectId}/todos")
    public ResponseEntity<List<Todo>> getTodosByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(todoService.getTodosByProject(projectId));
    }

    @GetMapping("/todos/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    @PostMapping("/projects/{projectId}/todos")
    public ResponseEntity<Todo> createTodo(@PathVariable Long projectId, @RequestBody Todo todo) {
        return new ResponseEntity<>(todoService.createTodo(projectId, todo), HttpStatus.CREATED);
    }

    @PutMapping("/todos/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.updateTodo(id, todo));
    }

    @PatchMapping("/todos/{id}/toggle")
    public ResponseEntity<Todo> toggleTodo(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.toggleTodo(id));
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}
