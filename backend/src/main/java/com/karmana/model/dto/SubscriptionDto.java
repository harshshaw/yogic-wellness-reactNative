package com.karmana.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

public class SubscriptionDto {

    /** POST /subscription — start or change a plan. */
    @Data
    public static class Request {
        @NotBlank private String plan;          // MONTHLY | YEARLY | LIFETIME | FREE
        private String paymentReference;         // from the billing/IAP flow
    }

    @Data
    @Builder
    public static class Response {
        private String plan;
        private String status;                   // ACTIVE | EXPIRED | CANCELLED
        private boolean premium;                 // convenience flag for the app
        private Instant expiresAt;
    }
}
