package com.karmana.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProgressDto {
    private int moodScore;
    private int energyScore;
    private int sleepScore;
    private int stressScore;   // 100 - moodScore
    private int overallScore;
    private String headline;
    private String message;
}
