package com.karmana.service;

import com.karmana.model.dto.UserProfileDto;
import com.karmana.model.entity.User;
import com.karmana.model.entity.UserProfile;
import com.karmana.repository.UserProfileRepository;
import com.karmana.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository profileRepo;
    private final UserRepository userRepo;

    public UserProfileDto save(String email, UserProfileDto dto) {
        User user = findUser(email);
        UserProfile profile = profileRepo.findByUserId(user.getId())
                .orElse(UserProfile.builder().user(user).build());

        profile.setAge(dto.getAge());
        profile.setGender(dto.getGender());
        profile.setOccupation(dto.getOccupation());
        profile.setHeightCm(dto.getHeightCm());
        profile.setWeightKg(dto.getWeightKg());
        profile.setActivityLevel(dto.getActivityLevel());
        profile.setGoals(dto.getGoals());
        profile.setMedicalConditions(dto.getMedicalConditions());
        profile.setHowHeard(dto.getHowHeard());
        profileRepo.save(profile);

        return toDto(profile);
    }

    public Optional<UserProfileDto> get(String email) {
        User user = findUser(email);
        return profileRepo.findByUserId(user.getId()).map(this::toDto);
    }

    private UserProfileDto toDto(UserProfile p) {
        return UserProfileDto.builder()
                .age(p.getAge()).gender(p.getGender()).occupation(p.getOccupation())
                .heightCm(p.getHeightCm()).weightKg(p.getWeightKg())
                .activityLevel(p.getActivityLevel()).goals(p.getGoals())
                .medicalConditions(p.getMedicalConditions()).howHeard(p.getHowHeard())
                .build();
    }

    private User findUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
