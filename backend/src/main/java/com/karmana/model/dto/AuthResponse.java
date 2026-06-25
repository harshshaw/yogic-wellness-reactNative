package com.karmana.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private boolean onboardingComplete;
}
