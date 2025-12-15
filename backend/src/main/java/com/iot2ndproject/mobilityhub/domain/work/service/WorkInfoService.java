package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dao.WorkInfoDAO;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
<<<<<<< HEAD
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkRepository;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorksearchRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
=======
>>>>>>> ba4d05fb4ea75b218349f4570ef0ce005222a2a2

import java.util.List;

public interface WorkInfoService {

<<<<<<< HEAD
    private final WorksearchRepository worksearchRepository;
    @Autowired
    private WorkInfoDAO dao;
    private final ModelMapper modelMapper;
=======
    // ✔ 금일 입차
    List<WorkInfoResponseDTO> getTodayEntryDTO();
>>>>>>> ba4d05fb4ea75b218349f4570ef0ce005222a2a2

    // ✔ 금일 출차
    List<WorkInfoResponseDTO> getTodayExitDTO();

<<<<<<< HEAD
        return worksearchRepository
                .findByEntryTimeBetween(start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ 금일 출차 조회
    public List<WorkInfoResponseDTO> getTodayExitDTO() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return worksearchRepository
                .findByExitTimeBetween(start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ Entity → DTO 변환
    private WorkInfoResponseDTO convertToDTO(WorkInfoEntity e) {
        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();

        dto.setId(e.getId());
        dto.setCarState(e.getCarState() != null ? e.getCarState().getNodeName() : null);
        dto.setEntryTime(e.getEntryTime());
        dto.setExitTime(e.getExitTime());

        // 차량 정보
        if (e.getUserCar().getCar() != null) {
            dto.setCarNumber(e.getUserCar().getCar().getCarNumber());
        }

        // 이미지 정보
        if (e.getImage() != null) {
            dto.setImagePath(e.getImage().getImagePath());
            dto.setCameraId(e.getImage().getCameraId());
        }

        return dto;
    }

    // 작업 목록 전부 불러오기
    public List<WorkInfoResponseDTO> findAll(){
        System.out.println("작업목록 service");

        return dao.findAll()
                .stream()
                .map(entity -> {
                    WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
                    dto.setWorkId(entity.getWork().getWorkId());
                    dto.setWorkType(entity.getWork().getWorkType());
                    dto.setEntryTime(entity.getRequestTime());
                    dto.setExitTime(entity.getExitTime());
                    // 나머지 필드(carNumber, cameraId 등)는 필요 없으면 안 채움
                    return dto;
                })
                .collect(Collectors.toList());


    }
=======
    // ✔ 번호판 수정
    void updatePlateNumber(Long workInfoId, String newCarNumber);
>>>>>>> ba4d05fb4ea75b218349f4570ef0ce005222a2a2
}
