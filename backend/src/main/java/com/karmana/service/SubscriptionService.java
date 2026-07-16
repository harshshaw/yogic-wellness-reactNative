package com.karmana.service;

import com.karmana.model.dto.SubscriptionDto;
import com.karmana.model.entity.Subscription;
import com.karmana.model.entity.User;
import com.karmana.repository.SubscriptionRepository;
import com.karmana.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepo;
    private final UserRepository userRepository;

    /** Current subscription — defaults to a FREE plan if the user has none yet. */
    public SubscriptionDto.Response get(String email) {
        User user = findUser(email);
        Subscription sub = subscriptionRepo.findByUserId(user.getId())
                .orElseGet(() -> Subscription.builder().user(user).build()); // FREE / ACTIVE defaults
        return toResponse(refreshStatus(sub));
    }

    /** Start or change a plan (called after a successful billing/IAP flow). */
    @Transactional
    public SubscriptionDto.Response subscribe(String email, SubscriptionDto.Request req) {
        User user = findUser(email);
        Subscription sub = subscriptionRepo.findByUserId(user.getId())
                .orElse(Subscription.builder().user(user).build());

        Subscription.Plan plan = parsePlan(req.getPlan());
        sub.setPlan(plan);
        sub.setStatus(Subscription.Status.ACTIVE);
        sub.setPaymentReference(req.getPaymentReference());
        sub.setExpiresAt(expiryFor(plan));
        subscriptionRepo.save(sub);
        return toResponse(sub);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    /** Lazily flip an ACTIVE-but-past-expiry subscription to EXPIRED (read-time). */
    private Subscription refreshStatus(Subscription sub) {
        if (sub.getStatus() == Subscription.Status.ACTIVE
                && sub.getExpiresAt() != null
                && sub.getExpiresAt().isBefore(Instant.now())) {
            sub.setStatus(Subscription.Status.EXPIRED);
            if (sub.getId() != null) subscriptionRepo.save(sub);
        }
        return sub;
    }

    private Instant expiryFor(Subscription.Plan plan) {
        return switch (plan) {
            case MONTHLY -> Instant.now().plus(30, ChronoUnit.DAYS);
            case YEARLY -> Instant.now().plus(365, ChronoUnit.DAYS);
            case LIFETIME, FREE -> null; // no expiry
        };
    }

    private Subscription.Plan parsePlan(String raw) {
        try {
            return Subscription.Plan.valueOf(raw.trim().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Unknown plan: " + raw);
        }
    }

    private SubscriptionDto.Response toResponse(Subscription sub) {
        boolean premium = sub.getStatus() == Subscription.Status.ACTIVE
                && sub.getPlan() != Subscription.Plan.FREE;
        return SubscriptionDto.Response.builder()
                .plan(sub.getPlan().name())
                .status(sub.getStatus().name())
                .premium(premium)
                .expiresAt(sub.getExpiresAt())
                .build();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
