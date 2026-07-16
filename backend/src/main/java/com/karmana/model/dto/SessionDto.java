package com.karmana.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.util.List;

public class SessionDto {

    /** POST /sessions — record a completed session. */
    @Data
    public static class Request {
        @NotBlank private String type;      // breathing | meditation | sleep | music | reflection
        private String title;
        private Integer durationSec;
        private String mood;
    }

    /** One day's activity for the last-7-days chart. */
    @Data
    @Builder
    public static class DayActivity {
        private String date;    // ISO yyyy-MM-dd
        private String label;   // Mon, Tue, ...
        private int sessions;
        private int minutes;
    }

    /** GET /sessions/stats — everything the Progress screen needs. */
    @Data
    @Builder
    public static class Stats {
        private int currentStreak;
        private int longestStreak;
        private long totalSessions;
        private int totalMinutes;
        private List<DayActivity> last7Days;
    }
}
