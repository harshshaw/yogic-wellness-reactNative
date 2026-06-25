package com.karmana.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "user_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String age;
    private String gender;
    private String occupation;
    private String heightCm;
    private String weightKg;
    private String activityLevel;

    @ElementCollection
    @CollectionTable(name = "user_goals", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "goal")
    private List<String> goals;

    @Column(columnDefinition = "TEXT")
    private String medicalConditions;

    private String howHeard;

    @UpdateTimestamp
    private Instant updatedAt;
}
