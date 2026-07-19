package com.karmana.service;

import com.karmana.model.dto.JournalDto;
import com.karmana.model.entity.JournalEntry;
import com.karmana.model.entity.User;
import com.karmana.repository.JournalEntryRepository;
import com.karmana.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JournalService {

    private final JournalEntryRepository journalRepo;
    private final UserRepository userRepository;

    @Transactional
    public JournalDto.Response create(String email, JournalDto.Request req) {
        User user = findUser(email);
        JournalEntry entry = JournalEntry.builder()
                .user(user)
                .entryDate(LocalDate.now())
                .prompt(req.getPrompt())
                .content(req.getContent())
                .mood(req.getMood())
                .build();
        journalRepo.save(entry);
        return toResponse(entry);
    }

    public List<JournalDto.Response> history(String email) {
        User user = findUser(email);
        return journalRepo.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = findUser(email);
        JournalEntry entry = journalRepo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Entry not found"));
        journalRepo.delete(entry);
    }

    private JournalDto.Response toResponse(JournalEntry e) {
        return JournalDto.Response.builder()
                .id(e.getId())
                .entryDate(e.getEntryDate())
                .prompt(e.getPrompt())
                .content(e.getContent())
                .mood(e.getMood())
                .createdAt(e.getCreatedAt())
                .build();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
