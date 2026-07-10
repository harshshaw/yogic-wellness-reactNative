package com.karmana.repository;

import com.karmana.model.entity.CompanionMemory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanionMemoryRepository extends JpaRepository<CompanionMemory, Long> {
    Optional<CompanionMemory> findByUserId(Long userId);
}
