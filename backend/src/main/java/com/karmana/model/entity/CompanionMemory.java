package com.karmana.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * A single, rolling summary of what the AI companion knows about a user —
 * distilled from their past conversations. One row per user.
 */
@Entity
@Table(name = "companion_memory")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanionMemory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /** Compact, distilled summary of the user (name, situation, themes, what helps). */
    @Column(columnDefinition = "TEXT")
    private String summary;

    @UpdateTimestamp
    private Instant updatedAt;
}
