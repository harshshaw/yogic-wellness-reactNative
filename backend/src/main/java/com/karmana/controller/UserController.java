package com.karmana.controller;

import com.karmana.model.dto.UserProfileDto;
import com.karmana.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService profileService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal UserDetails user) {
        return profileService.get(user.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> saveProfile(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(profileService.save(user.getUsername(), dto));
    }
}
