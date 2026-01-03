package com.iot2ndproject.mobilityhub.domain.entrance.service;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.*;
import com.iot2ndproject.mobilityhub.domain.entry.dto.RegisteredCarResponseDTO;

import java.util.List;

public interface EntranceService {

//    EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto);

    //void updateOcrNumber(Long imageId, String carNumber);

    EntranceResponseDTO getLatestEntrance();

    //
    CurrentEntranceCarResponseDTO getCurrentEntranceCar(int nodeId);

    void approveEntrance(Long workId);
    // 최신 이미지

    EntranceResponseDTO getLatestEntranceImage();
    // 오늘 입차/출차
    List<WorkInfoResponseDTO> getTodayEntryDTO();
    List<WorkInfoResponseDTO> getTodayExitDTO();

    // 작업 목록
    List<WorkInfoResponseDTO> findAll();
    List<WorkInfoResponseDTO> findAllToday();

    List<WorkInfoTotalListResponse> workInfoTotalList();
    // 번호판 수정
    void updatePlateNumber(Long workInfoId, String newCarNumber);

    void approveRegisteredCar(Long userCarId);
}
