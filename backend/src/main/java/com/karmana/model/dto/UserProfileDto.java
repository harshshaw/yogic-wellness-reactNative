package com.karmana.model.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserProfileDto {
    private String age;
    private String gender;
    private String occupation;
    private String heightCm;
    private String weightKg;
    private String activityLevel;
    private List<String> goals;
    private String medicalConditions;
    private String howHeard;
}
