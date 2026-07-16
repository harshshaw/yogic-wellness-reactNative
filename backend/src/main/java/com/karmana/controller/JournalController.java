package com.karmana.controller;

import com.karmana.model.dto.JournalDto;
import com.karmana.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;

    /** Create a journal entry. */
    @PostMapping
    public ResponseEntity<JournalDto.Response> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody JournalDto.Request req) {
        return ResponseEntity.ok(journalService.create(user.getUsername(), req));
    }

    /** Full history, newest first. */
    @GetMapping
    public ResponseEntity<List<JournalDto.Response>> history(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(journalService.history(user.getUsername()));
    }

    /** Delete an entry. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id) {
        journalService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
