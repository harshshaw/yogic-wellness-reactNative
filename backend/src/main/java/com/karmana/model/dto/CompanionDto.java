package com.karmana.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

public class CompanionDto {

    /** A single conversation turn sent from the app. */
    @Data
    public static class Turn {
        private String role;    // "user" | "ai"
        private String content;
    }

    /** POST /companion/turns — append one or more turns for a persona. */
    @Data
    public static class TurnsRequest {
        private String mode;
        @NotNull private List<Turn> turns;
    }

    /** PUT /companion/memory — replace the distilled summary. */
    @Data
    public static class MemoryRequest {
        private String summary;
    }

    /** GET/PUT /companion/memory response. */
    @Data
    @Builder
    public static class MemoryResponse {
        private String summary;
        private Instant updatedAt;
    }
}
