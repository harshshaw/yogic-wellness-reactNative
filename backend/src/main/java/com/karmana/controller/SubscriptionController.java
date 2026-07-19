package com.karmana.controller;

import com.karmana.model.dto.SubscriptionDto;
import com.karmana.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /** Current plan (defaults to FREE). */
    @GetMapping
    public ResponseEntity<SubscriptionDto.Response> get(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(subscriptionService.get(user.getUsername()));
    }

    /** Start or change a plan after a successful billing/IAP flow. */
    @PostMapping
    public ResponseEntity<SubscriptionDto.Response> subscribe(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody SubscriptionDto.Request req) {
        return ResponseEntity.ok(subscriptionService.subscribe(user.getUsername(), req));
    }
}
