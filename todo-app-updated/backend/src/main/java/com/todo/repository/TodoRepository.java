package com.todo.repository;

import com.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByProjectId(Long projectId);
    List<Todo> findByProjectIdAndCompleted(Long projectId, boolean completed);
}
