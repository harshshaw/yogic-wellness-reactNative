package com.karmana.repository;

import com.karmana.model.entity.CompanionMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanionMessageRepository extends JpaRepository<CompanionMessage, Long> {
    List<CompanionMessage> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
