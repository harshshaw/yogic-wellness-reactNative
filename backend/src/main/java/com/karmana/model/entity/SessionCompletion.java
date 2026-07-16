package com.karmana.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

/**
 * A completed wellness session (breathing, meditation, sleep, etc.). Powers the
 * progress screen: streaks, totals, and the last-7-days activity chart.
 */
@Entity
@Table(name = "session_completions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SessionCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // breathing | meditation | sleep | music | reflection
    private String type;

    private String title;

    /** Duration actually practised, in seconds. */
    @Builder.Default
    private Integer durationSec = 0;

    /** Optional post-session mood (e.g. "Lighter", "Clearer"). */
    private String mood;

    /** The calendar day this session counts toward (for streaks/day grouping). */
    @Column(nullable = false)
    private LocalDate completedDate;

    @CreationTimestamp
    private Instant createdAt;
}
