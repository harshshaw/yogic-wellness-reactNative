package com.karmana.service;

import com.karmana.model.dto.ProgressDto;
import com.karmana.model.dto.ReflectionDto;
import com.karmana.model.entity.MorningReflection;
import com.karmana.model.entity.User;
import com.karmana.repository.MorningReflectionRepository;
import com.karmana.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReflectionService {

    private final MorningReflectionRepository reflectionRepo;
    private final UserRepository userRepository;

    // Mirrors utils/reflectionProgress.ts scoring
    private static final Map<String, Integer> MOOD_SCORE = Map.of(
            "happy", 100, "calm", 90, "neutral", 60, "irritable", 40,
            "stressed", 35, "anxious", 30, "sad", 25, "overwhelmed", 20
    );
    private static final Map<String, Integer> ENERGY_SCORE = Map.of(
            "low", 20, "slightly_low", 40, "moderate", 60, "high", 80, "very_high", 100
    );
    private static final Map<String, Integer> SLEEP_SCORE = Map.of(
            "poor", 25, "average", 50, "good", 75, "excellent", 100
    );

    public ReflectionDto.Response save(String email, ReflectionDto.Request req) {
        User user = findUser(email);
        LocalDate date = Optional.ofNullable(req.getDate()).orElse(LocalDate.now());

        MorningReflection reflection = reflectionRepo
                .findByUserIdAndReflectionDate(user.getId(), date)
                .orElse(MorningReflection.builder().user(user).reflectionDate(date).build());

        reflection.setMood(req.getMood());
        reflection.setEnergy(req.getEnergy());
        reflection.setSleep(req.getSleep());
        reflection.setNotes(req.getNotes());
        reflectionRepo.save(reflection);

        return toResponse(reflection);
    }

    public Optional<ReflectionDto.Response> getToday(String email) {
        User user = findUser(email);
        return reflectionRepo.findByUserIdAndReflectionDate(user.getId(), LocalDate.now())
                .map(this::toResponse);
    }

    public List<ReflectionDto.Response> getHistory(String email) {
        User user = findUser(email);
        return reflectionRepo.findByUserIdOrderByReflectionDateDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    private ReflectionDto.Response toResponse(MorningReflection r) {
        ProgressDto progress = computeProgress(r.getMood(), r.getEnergy(), r.getSleep());
        return ReflectionDto.Response.builder()
                .id(r.getId())
                .reflectionDate(r.getReflectionDate())
                .mood(r.getMood())
                .energy(r.getEnergy())
                .sleep(r.getSleep())
                .notes(r.getNotes())
                .progress(progress)
                .build();
    }

    private ProgressDto computeProgress(String mood, String energy, String sleep) {
        int m = MOOD_SCORE.getOrDefault(mood, 60);
        int e = ENERGY_SCORE.getOrDefault(energy, 60);
        int s = SLEEP_SCORE.getOrDefault(sleep, 50);
        int overall = (m + e + s) / 3;
        int stress = 100 - m;

        String headline = overall >= 75 ? "You're thriving"
                : overall >= 50 ? "Steady progress"
                : "Take it easy today";
        String message = overall >= 75
                ? "Your wellness is in great shape. Keep up the routine."
                : overall >= 50
                ? "You're doing well. A little rest goes a long way."
                : "Be gentle with yourself. Small steps still count.";

        return ProgressDto.builder()
                .moodScore(m).energyScore(e).sleepScore(s)
                .stressScore(stress).overallScore(overall)
                .headline(headline).message(message)
                .build();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
