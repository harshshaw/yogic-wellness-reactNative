package com.karmana.controller;

import com.karmana.model.dto.ReflectionDto;
import com.karmana.service.ReflectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reflections")
@RequiredArgsConstructor
public class ReflectionController {

    private final ReflectionService reflectionService;

    /** Save or update today's reflection */
    @PostMapping
    public ResponseEntity<ReflectionDto.Response> save(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody ReflectionDto.Request req) {
        return ResponseEntity.ok(reflectionService.save(user.getUsername(), req));
    }

    /** Get today's reflection (if exists) */
    @GetMapping("/today")
    public ResponseEntity<ReflectionDto.Response> getToday(
            @AuthenticationPrincipal UserDetails user) {
        return reflectionService.getToday(user.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    /** Full history, newest first */
    @GetMapping("/history")
    public ResponseEntity<List<ReflectionDto.Response>> getHistory(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(reflectionService.getHistory(user.getUsername()));
    }
}
