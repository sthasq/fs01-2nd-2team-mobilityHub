package com.iot2ndproject.mobilityhub.domain.entrance.service;

import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.repository.CarRepository;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.OcrEntryRequestDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.car.repository.UserCarRepository;
import com.iot2ndproject.mobilityhub.domain.entrance.dao.EntranceDAO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoTotalListResponse;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntranceServiceImpl implements EntranceService {

    private final EntranceDAO entranceDAO;

    private final CarRepository carRepository;
    private final UserCarRepository userCarRepository;
    private final WorkInfoRepository workInfoRepository;

    // OCR 수신
    @Override
    public EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto) {

        ImageEntity image = new ImageEntity();
        image.setCameraId(dto.getCameraId());
        image.setImagePath(dto.getImagePath());
        image.setOcrNumber(dto.getOcrNumber());

        entranceDAO.save(image);

        // 자동 매칭
        autoMatch(image);

        EntranceResponseDTO response = new EntranceResponseDTO();
        response.setImageId((long) image.getImageId());
        response.setImagePath(image.getImagePath());
        response.setCameraId(image.getCameraId());
        response.setOcrNumber(image.getOcrNumber());
        response.setCorrectedOcrNumber(image.getCorrectedOcrNumber());
        response.setTime(image.getRegDate());
        response.setMatch(false);

        return response;
    }

    // OCR 수정 (관리자)
    @Override
    public void updateOcrNumber(Long imageId, String carNumber) {

        ImageEntity image = entranceDAO.findById(imageId);
        image.setCorrectedOcrNumber(carNumber);

        // 🔥 반드시 저장
        entranceDAO.save(image);

        // 🔥 OCR 수정 후 자동 매칭
        autoMatch(image);
    }

    // 최근 입차 조회
    @Override
    public EntranceResponseDTO getLatestEntrance() {

        EntranceEntryView v =
                workInfoRepository
                        .findTopByImageIsNotNullOrderByRequestTimeDesc()
                        .orElse(null);

        if (v == null) return null;

        EntranceResponseDTO dto = new EntranceResponseDTO();

        dto.setWorkId(v.getId());
        dto.setCarNumber(v.getUserCar_Car_CarNumber());
        dto.setImageId(
                v.getImage_ImageId() != null
                        ? v.getImage_ImageId().longValue()
                        : null
        );
        dto.setImagePath(v.getImage_ImagePath());
        dto.setCameraId(v.getImage_CameraId());
        dto.setOcrNumber(v.getImage_OcrNumber());
        dto.setCorrectedOcrNumber(v.getImage_CorrectedOcrNumber());
        dto.setTime(v.getRequestTime());

        dto.setMatch(true);

        return dto;
    }


    // OCR 자동 매칭 핵심 로직
    private void autoMatch(ImageEntity image) {

        String plate =
                image.getCorrectedOcrNumber() != null
                        ? image.getCorrectedOcrNumber()
                        : image.getOcrNumber();

        if (plate == null) return;

        UserCarEntity userCar =
                userCarRepository
                        .findByCar_CarNumber(plate)
                        .orElse(null);

        if (userCar == null) return;

        // 중복 매칭 방지
        if (workInfoRepository.existsByImage_ImageId(image.getImageId())) return;

        WorkInfoEntity workInfo = new WorkInfoEntity();
        workInfo.setUserCar(userCar);
        workInfo.setImage(image);
        workInfo.setRequestTime(LocalDateTime.now());

        WorkEntity entryWork = new WorkEntity();
        entryWork.setWorkId(1); // 입차
        workInfo.setWork(entryWork);

        workInfoRepository.save(workInfo);
    }


//    ===============================================
//    WorkInfoServiceImpl 파일 내부 코드
//    ===============================================

    // ✔ 금일 입차
    @Override
    public List<WorkInfoResponseDTO> getTodayEntryDTO() {
        LocalDate today = LocalDate.now();

        return workInfoRepository
                .findByEntryTimeBetween(
                        today.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ 금일 출차
    @Override
    public List<WorkInfoResponseDTO> getTodayExitDTO() {
        LocalDate today = LocalDate.now();

        return workInfoRepository
                .findByExitTimeBetween(
                        today.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkInfoTotalListResponse> workInfoTotalList() {

        List<WorkInfoTotalListResponse> list = entranceDAO.findAll().stream()
                .filter(entity -> entity.getRequestTime().toLocalDate().isEqual(LocalDate.now()))
                .map(WorkInfoTotalListResponse::new)
                .collect(Collectors.toList());

        return list;
    }

    // ✔ 번호판 수정
    @Override
    public void updatePlateNumber(Long workInfoId, String newCarNumber) {

        WorkInfoEntity workInfo = workInfoRepository.findById(workInfoId)
                .orElseThrow(() -> new IllegalArgumentException("입차 기록이 없습니다."));

        UserCarEntity userCar = workInfo.getUserCar();
        CarEntity car = userCar.getCar();

        car.setCarNumber(newCarNumber);
        carRepository.save(car);
    }

    // 모든 작업 목록 가져오기
    @Override
    public List<WorkInfoResponseDTO> findAll() {
        System.out.println("작업목록 service");

        return entranceDAO.findAll()
                .stream()
                .map(entity -> {
                    WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
                    dto.setWorkId(entity.getWork().getWorkId());
                    dto.setWorkType(entity.getWork().getWorkType());
                    dto.setEntryTime(entity.getRequestTime());
                    dto.setExitTime(entity.getExitTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 오늘 작업목록 전체 불러오기
    @Override
    public List<WorkInfoResponseDTO> findAllToday() {
        System.out.println("오늘작업목록 조회 service");

        LocalDate today = LocalDate.now();

        return entranceDAO.findAllToday()
                .stream()
                .filter(w -> {
                    LocalDate entryDate = w.getRequestTime().toLocalDate();
                    return entryDate.equals(today);
                })
                .map(w -> {
                    WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
                    dto.setWorkId(w.getWork().getWorkId());
                    dto.setWorkType(w.getWork().getWorkType());
                    dto.setEntryTime(w.getEntryTime());
                    dto.setExitTime(w.getExitTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 🔥 Projection → DTO 변환
    private WorkInfoResponseDTO convertToDTO(EntranceEntryView v) {

        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();

        dto.setId(Long.toString(v.getId()));
        dto.setEntryTime(v.getEntryTime());
        dto.setExitTime(v.getExitTime());
        dto.setCarNumber(v.getUserCar_Car_CarNumber());
        dto.setImagePath(v.getImage_ImagePath());

        dto.setCameraId(
                v.getImage_CameraId() != null
                        ? v.getImage_CameraId().toString()
                        : null
        );

        return dto;
    }

}
