package com.karmana.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

public class ReflectionDto {

    @Data
    public static class Request {
        @NotBlank private String mood;
        @NotBlank private String energy;
        @NotBlank private String sleep;
        private String notes;
        private LocalDate date; // defaults to today if null
    }

    @Data
    @Builder
    public static class Response {
        private Long id;
        private LocalDate reflectionDate;
        private String mood;
        private String energy;
        private String sleep;
        private String notes;
        private ProgressDto progress;
    }
}
