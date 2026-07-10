package com.karmana.service;

import com.karmana.model.dto.CompanionDto;
import com.karmana.model.entity.CompanionMemory;
import com.karmana.model.entity.CompanionMessage;
import com.karmana.model.entity.User;
import com.karmana.repository.CompanionMemoryRepository;
import com.karmana.repository.CompanionMessageRepository;
import com.karmana.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanionService {

    private final CompanionMemoryRepository memoryRepo;
    private final CompanionMessageRepository messageRepo;
    private final UserRepository userRepository;

    /** The distilled summary of what the companion knows about this user. */
    public CompanionDto.MemoryResponse getMemory(String email) {
        User user = findUser(email);
        return memoryRepo.findByUserId(user.getId())
                .map(m -> CompanionDto.MemoryResponse.builder()
                        .summary(m.getSummary())
                        .updatedAt(m.getUpdatedAt())
                        .build())
                .orElse(CompanionDto.MemoryResponse.builder().summary("").build());
    }

    /** Replace the distilled summary (produced by the distillation step). */
    @Transactional
    public CompanionDto.MemoryResponse saveMemory(String email, CompanionDto.MemoryRequest req) {
        User user = findUser(email);
        CompanionMemory memory = memoryRepo.findByUserId(user.getId())
                .orElse(CompanionMemory.builder().user(user).build());
        memory.setSummary(req.getSummary());
        memoryRepo.save(memory);
        return CompanionDto.MemoryResponse.builder()
                .summary(memory.getSummary())
                .updatedAt(memory.getUpdatedAt())
                .build();
    }

    /** Append raw conversation turns to the log. */
    @Transactional
    public void saveTurns(String email, CompanionDto.TurnsRequest req) {
        User user = findUser(email);
        if (req.getTurns() == null) return;
        for (CompanionDto.Turn turn : req.getTurns()) {
            if (turn.getContent() == null || turn.getContent().isBlank()) continue;
            messageRepo.save(CompanionMessage.builder()
                    .user(user)
                    .mode(req.getMode())
                    .role(turn.getRole())
                    .content(turn.getContent())
                    .build());
        }
    }

    /** Most recent turns (newest first), for re-distillation or history. */
    public java.util.List<CompanionMessage> recentMessages(String email, int limit) {
        User user = findUser(email);
        return messageRepo.findByUserIdOrderByCreatedAtDesc(
                user.getId(), PageRequest.of(0, Math.max(1, Math.min(limit, 100))));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
