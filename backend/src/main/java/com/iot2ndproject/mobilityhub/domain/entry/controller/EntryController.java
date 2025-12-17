package com.iot2ndproject.mobilityhub.domain.entry.controller;

import com.iot2ndproject.mobilityhub.domain.entrance.service.EntranceService;
import com.iot2ndproject.mobilityhub.domain.entry.dto.OcrEntryRequest;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.entry.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entry")
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;
    private final EntranceService entranceService;


    @PostMapping("/ocr")
    public WorkInfoEntity createEntry(@RequestBody OcrEntryRequest req) {
        return entryService.handleEntry(req);
    }

    @GetMapping("/today/entry")
    public List<WorkInfoResponseDTO> todayEntry() {
        return entranceService.getTodayEntryDTO();
    }

    @PostMapping("/{workInfoId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long workInfoId) {
        entryService.approveEntrance(workInfoId);
        return ResponseEntity.ok().build();
    }

}
