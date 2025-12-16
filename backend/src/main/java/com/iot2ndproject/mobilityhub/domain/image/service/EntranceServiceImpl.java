package com.iot2ndproject.mobilityhub.domain.image.service;

import com.iot2ndproject.mobilityhub.domain.image.dao.ImageDAO;
import com.iot2ndproject.mobilityhub.domain.image.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.image.dto.OcrEntryRequestDTO;
import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.UserCarRepository;
import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class EntranceServiceImpl implements EntranceService {

    private final ImageDAO imageDAO;
    private final UserCarRepository userCarRepository;
    private final WorkInfoRepository workInfoRepository;

    // =========================
    // 📸 OCR 수신
    // =========================
    @Override
    public EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto) {

        ImageEntity image = new ImageEntity();
        image.setCameraId(dto.getCameraId());
        image.setImagePath(dto.getImagePath());
        image.setOcrNumber(dto.getOcrNumber());

        imageDAO.save(image);

        // 🔥 자동 매칭
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

    // =========================
    // ✏ OCR 수정 (관리자)
    // =========================
    @Override
    public void updateOcrNumber(Long imageId, String carNumber) {

        ImageEntity image = imageDAO.findById(imageId);
        image.setCorrectedOcrNumber(carNumber);

        // 🔥 반드시 저장
        imageDAO.save(image);

        // 🔥 OCR 수정 후 자동 매칭
        autoMatch(image);
    }

    // =========================
    // 🆕 최근 입차 조회
    // =========================
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

        // work_info 있으면 매칭 성공
        dto.setMatch(true);

        return dto;
    }

    // =========================
    // 🔥 OCR 자동 매칭 핵심 로직
    // =========================
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

        // 🔒 중복 매칭 방지
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
}
