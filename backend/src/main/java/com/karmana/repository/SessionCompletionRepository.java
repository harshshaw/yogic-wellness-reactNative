package com.karmana.repository;

import com.karmana.model.entity.SessionCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SessionCompletionRepository extends JpaRepository<SessionCompletion, Long> {

    List<SessionCompletion> findByUserIdOrderByCompletedDateDesc(Long userId);

    List<SessionCompletion> findByUserIdAndCompletedDateBetween(
            Long userId, LocalDate from, LocalDate to);

    long countByUserId(Long userId);
}
