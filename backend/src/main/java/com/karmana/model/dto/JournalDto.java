package com.karmana.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

public class JournalDto {

    /** POST /journal — create an entry. */
    @Data
    public static class Request {
        private String prompt;
        @NotBlank private String content;
        private String mood;
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private LocalDate entryDate;
        private String prompt;
        private String content;
        private String mood;
        private Instant createdAt;
    }
}
