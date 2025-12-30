package com.iot2ndproject.mobilityhub.domain.entry.service;

import com.iot2ndproject.mobilityhub.domain.entry.dao.EntryDAO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryViewDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.global.mqtt.MyPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EntryServiceImpl implements EntryService {

    private final EntryDAO entryDAO;
    private final MyPublisher mqttPublisher;
    /**
     * 📊 금일 입차 조회
     */
    @Override
    public List<EntranceEntryViewDTO> getTodayEntry() {

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return entryDAO.findTodayEntry(start, end)
                .stream()
                .map(work -> {
                    EntranceEntryViewDTO dto = new EntranceEntryViewDTO();

                    dto.setId(work.getId());
                    dto.setEntryTime(work.getEntryTime());

                    if (work.getUserCar() != null && work.getUserCar().getCar() != null) {
                        dto.setCarNumber(work.getUserCar().getCar().getCarNumber());
                    }

                    if (work.getImage() != null) {
                        dto.setImagePath(work.getImage().getImagePath());
                        dto.setCameraId(work.getImage().getCameraId());
                    }

                    return dto;
                })
                .toList();
    }

    /**
     *  입차 승인
     */
    @Override
    public void approveEntrance(Long id) {

        WorkInfoEntity workInfo = entryDAO.findWorkInfoById(id).orElse(null);

        //  work_info 없으면 새로 생성 (OCR만 있는 상태)
        if (workInfo == null) {
            workInfo = new WorkInfoEntity();
            workInfo.setEntryTime(LocalDateTime.now());
            entryDAO.save(workInfo);
        } else {
            if (workInfo.getEntryTime() == null) {
                workInfo.setEntryTime(LocalDateTime.now());
                entryDAO.save(workInfo);
            }
        }

        // 🔓 게이트 열기
        mqttPublisher.sendToMqtt(
                "open",
                "parking/web/entrance/approve"
        );
    }

}
