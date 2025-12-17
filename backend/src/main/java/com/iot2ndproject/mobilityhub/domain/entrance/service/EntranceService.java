package com.iot2ndproject.mobilityhub.domain.entrance.service;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.OcrEntryRequestDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoTotalListResponse;

import java.util.List;

public interface EntranceService {

    // OCR 수신
    EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto);

    // OCR 수정 (관리자)
    void updateOcrNumber(Long imageId, String carNumber);

    // 최근 입차 조회
    EntranceResponseDTO getLatestEntrance();
    
//    ===============================================
//    WorkInfoService 파일 내부 코드
//    ===============================================

    // 작업 전체 목록 보기
    List<WorkInfoResponseDTO> findAll();

    // 오늘 작업 목록만 가져오기
    List<WorkInfoResponseDTO> findAllToday();

    // 종합 리스트
    List<WorkInfoTotalListResponse> workInfoTotalList();

    // ✔ 금일 입차
    List<WorkInfoResponseDTO> getTodayEntryDTO();

    // ✔ 금일 출차
    List<WorkInfoResponseDTO> getTodayExitDTO();

    // ✔ 번호판 수정
    void updatePlateNumber(Long workInfoId, String newCarNumber);
}
