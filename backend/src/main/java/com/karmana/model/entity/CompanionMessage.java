package com.karmana.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * A single turn in an AI companion conversation, kept as a raw log so memory
 * can be re-distilled and history reviewed.
 */
@Entity
@Table(name = "companion_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanionMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Which companion persona this turn belongs to (e.g. "Relationship Guru"). */
    private String mode;

    // role: user | ai
    private String role;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    private Instant createdAt;
}
