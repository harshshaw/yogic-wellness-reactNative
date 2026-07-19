package com.karmana.controller;

import com.karmana.model.dto.SessionDto;
import com.karmana.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    /** Record a completed session. */
    @PostMapping
    public ResponseEntity<Void> record(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody SessionDto.Request req) {
        sessionService.record(user.getUsername(), req);
        return ResponseEntity.noContent().build();
    }

    /** Streaks, totals, and last-7-days activity for the Progress screen. */
    @GetMapping("/stats")
    public ResponseEntity<SessionDto.Stats> stats(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(sessionService.stats(user.getUsername()));
    }
}
