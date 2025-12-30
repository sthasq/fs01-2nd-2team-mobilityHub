package com.iot2ndproject.mobilityhub.domain.entry.controller;

import com.iot2ndproject.mobilityhub.domain.entrance.service.EntranceService;
import com.iot2ndproject.mobilityhub.domain.entry.dto.RegisteredCarResponseDTO;
import com.iot2ndproject.mobilityhub.domain.entry.service.EntryService;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryViewDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/entry")
public class EntryController {

    private final EntryService entryService;
    private final EntranceService entranceService;

    @GetMapping("/today")
    public List<EntranceEntryViewDTO> todayEntry() {
        return entryService.getTodayEntry();
    }

    @PostMapping("/{workId}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long workId) {
        entryService.approveEntrance(workId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/registered-cars")
    public List<RegisteredCarResponseDTO> registeredCars() {
        return entryService.getRegisteredCarsForEntrance();
    }

}
