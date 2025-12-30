package com.iot2ndproject.mobilityhub.domain.entrance.service;
import com.iot2ndproject.mobilityhub.domain.car.dao.CarDAO;
import com.iot2ndproject.mobilityhub.domain.car.dao.UserCarDAO;
import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.dao.EntranceDAO;
import com.iot2ndproject.mobilityhub.domain.entrance.dao.ImageDAO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.*;
import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.entry.dto.RegisteredCarResponseDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.dao.WorkInfoDAO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.global.mqtt.MyPublisher;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntranceServiceImpl implements EntranceService {

    private final EntranceDAO entranceDAO;
    private final ImageDAO imageDAO;
    private final CarDAO carDAO;
    private final WorkInfoDAO workInfoDAO;
    private final MyPublisher mqttPublisher;
    private final UserCarDAO userCarDAO;

    /**
     *  최신 이미지 + 최근 입차 상태 (메인 카드)
     */
    @Override
    public EntranceResponseDTO getLatestEntranceImage() {

        ImageEntity image = imageDAO.findLatest();
        WorkInfoEntity work = null;
//                entranceDAO.findLatestEntranceWithImage().orElse(null);

        EntranceResponseDTO dto = new EntranceResponseDTO();

        if (image != null) {
            dto.setImageId((long) image.getImageId());
            dto.setImagePath(image.getImagePath());
            dto.setCameraId(image.getCameraId());
            dto.setOcrNumber(image.getOcrNumber());
            dto.setCorrectedOcrNumber(image.getCorrectedOcrNumber());
            dto.setTime(image.getRegDate());
        }

        if (work != null && work.getUserCar() != null && work.getUserCar().getCar() != null) {
            dto.setWorkId(work.getId());
            dto.setCarNumber(work.getUserCar().getCar().getCarNumber());
            dto.setMatch(true);
        } else {
            dto.setMatch(false);
        }

        return dto;
    }

    @Override
    public EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto) {

        ImageEntity image = new ImageEntity();
        image.setCameraId(dto.getCameraId());
        image.setImagePath(dto.getImagePath());
        image.setOcrNumber(dto.getOcrNumber());

        entranceDAO.save(image);
        autoMatch(image);

        EntranceResponseDTO response = new EntranceResponseDTO();
        response.setImageId((long) image.getImageId());
        response.setImagePath(image.getImagePath());
        response.setCameraId(image.getCameraId());
        response.setOcrNumber(image.getOcrNumber());
        response.setTime(image.getRegDate());
        response.setMatch(false);

        return response;
    }

    @Override
    public void updateOcrNumber(Long imageId, String carNumber) {

        ImageEntity image = entranceDAO.findById(imageId);
        image.setCorrectedOcrNumber(carNumber);
        entranceDAO.save(image);

        autoMatch(image);
    }



    @Override
    public EntranceResponseDTO getLatestEntrance() {

        ImageEntity image = imageDAO.findLatest();

        WorkInfoEntity work = null;
        if (image != null) {
            work = null;
//                    entranceDAO.findByImageId((long) image.getImageId())
//                    .orElse(null);
        }

        EntranceResponseDTO dto = new EntranceResponseDTO();

        if (image != null) {
            dto.setImageId((long) image.getImageId());
            dto.setImagePath(image.getImagePath());
            dto.setCameraId(image.getCameraId());
            dto.setOcrNumber(image.getOcrNumber());
            dto.setCorrectedOcrNumber(image.getCorrectedOcrNumber());
            dto.setTime(image.getRegDate());
        }

        if (work != null && work.getUserCar() != null) {
            dto.setWorkId(work.getId());
            dto.setCarNumber(work.getUserCar().getCar().getCarNumber());
            dto.setMatch(true);
            dto.setApproved(work.getEntryTime() != null);
        } else {
            dto.setMatch(false);
        }

        return dto;
    }



    private void autoMatch(ImageEntity image) {

        String plate = image.getCorrectedOcrNumber() != null
                ? image.getCorrectedOcrNumber()
                : image.getOcrNumber();

        if (plate == null) return;

        UserCarEntity userCar = carDAO.findUserCarByCarNumber(plate).orElse(null);
        if (userCar == null) return;

        if (workInfoDAO.existsByImageId((long) image.getImageId())) return;

        WorkInfoEntity workInfo = new WorkInfoEntity();
        workInfo.setUserCar(userCar);
        workInfo.setImage(image);
        workInfo.setRequestTime(LocalDateTime.now());

        WorkEntity entryWork = new WorkEntity();
        entryWork.setWorkId(1);
        workInfo.setWork(entryWork);

        workInfoDAO.save(workInfo);
    }

    @Override
    public List<WorkInfoResponseDTO> getTodayEntryDTO() {
        LocalDate today = LocalDate.now();
        return entranceDAO
                .findEntryBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay())
                .stream()
                .map(this::convertToDTOFromWorkInfo)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkInfoResponseDTO> getTodayExitDTO() {
        LocalDate today = LocalDate.now();
        return entranceDAO
                .findExitBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay())
                .stream()
                .map(this::convertToDTOFromWorkInfo)
                .collect(Collectors.toList());
    }
    public List<WorkInfoResponseDTO> getTodayEnteredCars() {

        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDateTime.now();

        return workInfoDAO
                .findByEntryTimeIsNotNullAndEntryTimeBetween(start, end)
                .stream()
                .map(this::convertToDTOFromWorkInfo)
                .toList();
    }





    @Override
    public List<WorkInfoResponseDTO> findAll() {
        return entranceDAO.findAll()
                .stream()
                .map(this::convertToDTOFromWorkInfo)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkInfoResponseDTO> findAllToday() {
        return entranceDAO.findAllToday()
                .stream()
                .map(this::convertToDTOFromWorkInfo)
                .collect(Collectors.toList());
    }

    @Override
    public List<WorkInfoTotalListResponse> workInfoTotalList() {
        return List.of();
    }
    @Override
    public List<RegisteredCarResponseDTO> getRegisteredCarsForEntrance() {

        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().plusDays(1).atStartOfDay();

        //  오늘 입차한 WorkInfo 조회
        List<WorkInfoEntity> todayEntered =
                workInfoDAO.findByEntryTimeIsNotNullAndEntryTimeBetween(start, end);

        //  오늘 입차한 userCarId 목록
        Set<Long> enteredUserCarIds = todayEntered.stream()
                .map(w -> w.getUserCar().getId())
                .collect(Collectors.toSet());

        // ✅ 등록 차량 중 "오늘 입차 안 한 차량"만 필터
        return userCarDAO.findAll().stream()
                .filter(uc -> !enteredUserCarIds.contains(uc.getId()))
                .map(uc -> new RegisteredCarResponseDTO(
                        uc.getId(),
                        uc.getUser().getUserName(),
                        uc.getCar().getCarNumber()
                ))
                .toList();
    }


    @Override
    public void updatePlateNumber(Long workInfoId, String newCarNumber) {

        WorkInfoEntity workInfo = workInfoDAO.findById(workInfoId)
                .orElseThrow(() -> new IllegalArgumentException("입차 기록이 없습니다."));

        UserCarEntity userCar = workInfo.getUserCar();
        CarEntity car = (userCar != null) ? userCar.getCar() : null;
        if (car == null) throw new IllegalArgumentException("차량 정보가 없습니다.");

        car.setCarNumber(newCarNumber);
        carDAO.save(car);
    }

    @Override
    public void approveRegisteredCar(Long userCarId) {
        UserCarEntity userCar = userCarDAO.findById(userCarId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량 없음"));


        boolean alreadyEnteredToday =
                workInfoDAO.existsByUserCarAndEntryTimeBetween(
                        userCar,
                        LocalDate.now().atStartOfDay(),
                        LocalDate.now().plusDays(1).atStartOfDay()
                );

        if (alreadyEnteredToday) {
            throw new IllegalStateException("이미 입차된 차량입니다.");
        }

        WorkInfoEntity work = new WorkInfoEntity();
        work.setUserCar(userCar);
        work.setEntryTime(LocalDateTime.now());

        workInfoDAO.save(work);

        mqttPublisher.sendToMqtt(
                "open",
                "parking/web/entrance/approve"
        );
    }




    private WorkInfoResponseDTO convertToDTOFromWorkInfo(WorkInfoEntity w) {

        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
        dto.setId(String.valueOf(w.getId()));
        dto.setEntryTime(w.getEntryTime() != null ? w.getEntryTime() : w.getRequestTime());
        dto.setExitTime(w.getExitTime());

        if (w.getUserCar() != null && w.getUserCar().getCar() != null) {
            dto.setCarNumber(w.getUserCar().getCar().getCarNumber());
        }

        if (w.getImage() != null) {
            dto.setImagePath(w.getImage().getImagePath());
            dto.setCameraId(w.getImage().getCameraId());
        }

        return dto;
    }


}
