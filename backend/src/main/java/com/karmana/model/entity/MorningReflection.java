package com.karmana.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
    name = "morning_reflections",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "reflection_date"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MorningReflection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate reflectionDate;

    // mood: happy | calm | neutral | irritable | stressed | anxious | sad | overwhelmed
    private String mood;

    // energy: low | slightly_low | moderate | high | very_high
    private String energy;

    // sleep: poor | average | good | excellent
    private String sleep;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private Instant createdAt;
}
