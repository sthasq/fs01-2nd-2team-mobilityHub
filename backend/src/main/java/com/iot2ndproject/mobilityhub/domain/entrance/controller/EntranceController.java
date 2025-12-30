package com.iot2ndproject.mobilityhub.domain.entrance.controller;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.*;
import com.iot2ndproject.mobilityhub.domain.entrance.service.EntranceService;
import com.iot2ndproject.mobilityhub.domain.entry.service.EntryService;
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

    //가장 최근에 저장된 입구 카메라 캡처 이미지 정보
    @GetMapping("/latest_image")
    public ResponseEntity<?> getLatestEntranceImage() {
        return ResponseEntity.ok(entranceService.getLatestEntranceImage());
    }

    // OCR 모듈(라즈베리파이/서버 AI)이 추출한 차량 번호판 문자열 + 부가 데이터
    @PostMapping("/ocr")
    public ResponseEntity<?> ocr(@RequestBody OcrEntryRequestDTO dto) {
        return ResponseEntity.ok(entranceService.receiveOcr(dto));
    }

    // 입차 승인
    @PostMapping("/{workId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long workId) {
        entryService.approveEntrance(workId);
        return ResponseEntity.ok().build();
    }

    // “가장 최근 입차(또는 OCR 인식 결과 기반)의 대표 정보”
    @GetMapping("/latest")
    public ResponseEntity<EntranceResponseDTO> latest() {
        return ResponseEntity.ok(entranceService.getLatestEntrance());
    }

    // work_info 테이블 기반의 전체 작업 기록
    @GetMapping("/work/list")
    public List<WorkInfoResponseDTO> workInfolist() {
        return entranceService.findAll();
    }

    // 오늘 작업만 전체 목록
    @GetMapping("/work/today")
    public List<WorkInfoResponseDTO> workInfoToday() {
        return entranceService.findAllToday();
    }
    // “한 화면에서 모든 정보 보여주는 리스트”
    @GetMapping("/work/totalList")
    public List<WorkInfoTotalListResponse> workInfoTotalList() {
        return entranceService.workInfoTotalList();
    }

    // 금일 입차
    @GetMapping("/today/entry")
    public List<WorkInfoResponseDTO> getTodayEntry() {
        return entranceService.getTodayEntryDTO();
    }

    // 금일 출차
    @GetMapping("/today/exit")
    public List<WorkInfoResponseDTO> getTodayExit() {
        return entranceService.getTodayExitDTO();
    }

    // 번호판 수정
    @PutMapping("/{id}/plate")
    public ResponseEntity<?> updatePlate(@PathVariable Long id,
                                         @RequestBody PlateUpdateRequest request) {
        entranceService.updatePlateNumber(id, request.getCarNumber());
        return ResponseEntity.ok().build();
    }

    // OCR 수정 (관리자)
    @PutMapping("/image/{imageId}/ocr")
    public ResponseEntity<?> updateOcr(@PathVariable Long imageId,
                                       @RequestBody OcrUpdateRequestDTO dto) {
        entranceService.updateOcrNumber(imageId, dto.getCarNumber());
        return ResponseEntity.ok().build();
    }


    @PostMapping("/approve/registered/{userCarId}")
    public ResponseEntity<Void> approveRegisteredCar(
            @PathVariable Long userCarId) {

        entranceService.approveRegisteredCar(userCarId);
        return ResponseEntity.ok().build();
    }
    
}
