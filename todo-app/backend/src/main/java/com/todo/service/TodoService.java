package com.todo.service;

import com.todo.model.Project;
import com.todo.model.Todo;
import com.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final ProjectService projectService;

    public List<Todo> getTodosByProject(Long projectId) {
        return todoRepository.findByProjectId(projectId);
    }

    public Todo getTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
    }

    public Todo createTodo(Long projectId, Todo todo) {
        Project project = projectService.getProjectById(projectId);
        todo.setProject(project);
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Todo todoDetails) {
        Todo todo = getTodoById(id);
        todo.setTitle(todoDetails.getTitle());
        todo.setDescription(todoDetails.getDescription());
        todo.setCompleted(todoDetails.isCompleted());
        todo.setPriority(todoDetails.getPriority());
        todo.setDueDate(todoDetails.getDueDate());
        return todoRepository.save(todo);
    }

    public Todo toggleTodo(Long id) {
        Todo todo = getTodoById(id);
        todo.setCompleted(!todo.isCompleted());
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        Todo todo = getTodoById(id);
        todoRepository.delete(todo);
    }
}
