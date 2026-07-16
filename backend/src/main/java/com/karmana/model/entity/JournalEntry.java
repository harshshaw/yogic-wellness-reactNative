package com.karmana.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

/**
 * A single daily-journal entry — a guided prompt, the user's writing, and an
 * optional mood tag. Multiple entries per day are allowed.
 */
@Entity
@Table(name = "journal_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate entryDate;

    /** The guided prompt shown when writing (may be blank for free entries). */
    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String content;

    /** Optional mood tag, e.g. "calm", "grateful", "anxious". */
    private String mood;

    @CreationTimestamp
    private Instant createdAt;
}
