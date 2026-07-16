package com.karmana.service;

import com.karmana.model.dto.SessionDto;
import com.karmana.model.entity.SessionCompletion;
import com.karmana.model.entity.User;
import com.karmana.repository.SessionCompletionRepository;
import com.karmana.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionCompletionRepository sessionRepo;
    private final UserRepository userRepository;

    /** Record a completed session against today. */
    @Transactional
    public void record(String email, SessionDto.Request req) {
        User user = findUser(email);
        sessionRepo.save(SessionCompletion.builder()
                .user(user)
                .type(req.getType())
                .title(req.getTitle())
                .durationSec(req.getDurationSec() == null ? 0 : req.getDurationSec())
                .mood(req.getMood())
                .completedDate(LocalDate.now())
                .build());
    }

    /** Streaks, totals, and the last-7-days activity chart. */
    public SessionDto.Stats stats(String email) {
        User user = findUser(email);
        List<SessionCompletion> all = sessionRepo.findByUserIdOrderByCompletedDateDesc(user.getId());

        // Group by day for streaks + chart.
        Set<LocalDate> activeDays = new HashSet<>();
        Map<LocalDate, Integer> sessionsByDay = new HashMap<>();
        Map<LocalDate, Integer> minutesByDay = new HashMap<>();
        int totalMinutes = 0;
        for (SessionCompletion s : all) {
            LocalDate d = s.getCompletedDate();
            activeDays.add(d);
            sessionsByDay.merge(d, 1, Integer::sum);
            int mins = Math.round((s.getDurationSec() == null ? 0 : s.getDurationSec()) / 60f);
            minutesByDay.merge(d, mins, Integer::sum);
            totalMinutes += mins;
        }

        LocalDate today = LocalDate.now();
        int currentStreak = computeCurrentStreak(activeDays, today);
        int longestStreak = computeLongestStreak(activeDays);

        // Last 7 days, oldest → newest.
        List<SessionDto.DayActivity> week = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            week.add(SessionDto.DayActivity.builder()
                    .date(d.toString())
                    .label(d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .sessions(sessionsByDay.getOrDefault(d, 0))
                    .minutes(minutesByDay.getOrDefault(d, 0))
                    .build());
        }

        return SessionDto.Stats.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .totalSessions(all.size())
                .totalMinutes(totalMinutes)
                .last7Days(week)
                .build();
    }

    /** Consecutive active days ending today (or yesterday, so a streak survives until the day ends). */
    private int computeCurrentStreak(Set<LocalDate> days, LocalDate today) {
        LocalDate cursor;
        if (days.contains(today)) cursor = today;
        else if (days.contains(today.minusDays(1))) cursor = today.minusDays(1);
        else return 0;

        int streak = 0;
        while (days.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }

    private int computeLongestStreak(Set<LocalDate> days) {
        if (days.isEmpty()) return 0;
        List<LocalDate> sorted = new ArrayList<>(days);
        Collections.sort(sorted);
        int longest = 1, run = 1;
        for (int i = 1; i < sorted.size(); i++) {
            if (sorted.get(i - 1).plusDays(1).equals(sorted.get(i))) {
                run++;
            } else {
                run = 1;
            }
            longest = Math.max(longest, run);
        }
        return longest;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
