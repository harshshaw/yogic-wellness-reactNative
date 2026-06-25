package com.karmana.repository;

import com.karmana.model.entity.MorningReflection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MorningReflectionRepository extends JpaRepository<MorningReflection, Long> {
    Optional<MorningReflection> findByUserIdAndReflectionDate(Long userId, LocalDate date);
    List<MorningReflection> findByUserIdOrderByReflectionDateDesc(Long userId);
    List<MorningReflection> findByUserIdAndReflectionDateBetweenOrderByReflectionDateDesc(
            Long userId, LocalDate from, LocalDate to);
}
