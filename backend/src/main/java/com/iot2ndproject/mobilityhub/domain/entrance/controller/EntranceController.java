package com.iot2ndproject.mobilityhub.domain.entrance.controller;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.OcrEntryRequestDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.OcrUpdateRequestDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.repository.ImageRepository;
import com.iot2ndproject.mobilityhub.domain.entrance.service.EntranceService;
import com.iot2ndproject.mobilityhub.domain.entry.service.EntryService;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.PlateUpdateRequest;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoTotalListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entrance")
@RequiredArgsConstructor
public class EntranceController {

    private final EntranceService entranceService;
    private final EntryService entryService;

    private final ImageRepository imageRepository;

    @GetMapping("/latest_image")
    public ResponseEntity<?> getLatestEntranceImage() {

        ImageEntity image = imageRepository.findTopByOrderByRegDateDesc();

        if (image == null) {
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(image);
    }

    // OCR 수신
    @PostMapping("/ocr")
    public ResponseEntity<?> ocr(@RequestBody OcrEntryRequestDTO dto) {
        return ResponseEntity.ok(entranceService.receiveOcr(dto));
    }

    // OCR 수정 (관리자)
    @PutMapping("/image/{imageId}/ocr")
    public ResponseEntity<?> updateOcr( @PathVariable Long imageId, @RequestBody OcrUpdateRequestDTO dto) {
        entranceService.updateOcrNumber(imageId, dto.getCarNumber());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{workId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long workId) {
        entryService.approveEntrance(workId);
        return ResponseEntity.ok().build();
    }

    // 최근 입차 조회
    @GetMapping("/latest")
    public ResponseEntity<EntranceResponseDTO> latest() {
        return ResponseEntity.ok(entranceService.getLatestEntrance());
    }

//    ============================================================
//    workInfoController도 첫 매핑이 /entrance라 아래에 병합처리
//    ============================================================

    //작업 전체 목록
    @GetMapping("/work/list")
    public List<WorkInfoResponseDTO> workInfolist(){
        List<WorkInfoResponseDTO> list = entranceService.findAll();

        return list;
    }

    // 오늘 작업만 전체 목록
    @GetMapping("/work/today")
    public List<WorkInfoResponseDTO> workInfoToday(){
        List<WorkInfoResponseDTO> todaywork = entranceService.findAllToday();
        return todaywork;
    }

    @GetMapping("/work/totalList")
    public List<WorkInfoTotalListResponse> workInfoTotalList(){
        return entranceService.workInfoTotalList();
    }

    // ✔ 금일 입차
    @GetMapping("/today/entry")
    public List<WorkInfoResponseDTO> getTodayEntry() {
        return entranceService.getTodayEntryDTO();
    }

    // ✔ 금일 출차
    @GetMapping("/today/exit")
    public List<WorkInfoResponseDTO> getTodayExit() {
        return entranceService.getTodayExitDTO();
    }

    // ✔ 번호판 수정
    @PutMapping("/{id}/plate")
    public ResponseEntity<?> updatePlate(
            @PathVariable Long id,
            @RequestBody PlateUpdateRequest request
    ) {
        entranceService.updatePlateNumber(id, request.getCarNumber());
        return ResponseEntity.ok().build();
    }
}
