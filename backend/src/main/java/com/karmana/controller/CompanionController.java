package com.karmana.controller;

import com.karmana.model.dto.CompanionDto;
import com.karmana.service.CompanionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Persistent memory for the AI companion. Stores raw conversation turns and a
 * rolling distilled summary so the AI can recall and personalise across sessions.
 * All routes require authentication (see SecurityConfig — anyRequest authenticated).
 */
@RestController
@RequestMapping("/companion")
@RequiredArgsConstructor
public class CompanionController {

    private final CompanionService companionService;

    /** The distilled "what I know about this user" summary. */
    @GetMapping("/memory")
    public ResponseEntity<CompanionDto.MemoryResponse> getMemory(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(companionService.getMemory(user.getUsername()));
    }

    /** Replace the distilled summary (produced by the distillation step). */
    @PutMapping("/memory")
    public ResponseEntity<CompanionDto.MemoryResponse> saveMemory(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody CompanionDto.MemoryRequest req) {
        return ResponseEntity.ok(companionService.saveMemory(user.getUsername(), req));
    }

    /** Append conversation turns to the raw log. */
    @PostMapping("/turns")
    public ResponseEntity<Void> saveTurns(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CompanionDto.TurnsRequest req) {
        companionService.saveTurns(user.getUsername(), req);
        return ResponseEntity.noContent().build();
    }
}
