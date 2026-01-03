package com.iot2ndproject.mobilityhub.domain.entrance.dao;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.repository.ImageRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.ParkingMapNodeEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.ParkingMapNodeRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EntranceDAOImpl implements EntranceDAO {

    private final WorkInfoRepository workInfoRepository;
    private final ImageRepository imageRepository;
    private final ParkingMapNodeRepository parkingMapNodeRepository;


    @Transactional
    @Override
    public void createEntranceWorkInfo(ImageEntity image) {

        ParkingMapNodeEntity entranceNode =
                parkingMapNodeRepository.findByNodeId(1)
                        .orElseThrow(() -> new IllegalStateException("입구 노드 없음"));

        // 2. work_info 생성
        WorkInfoEntity workInfo = new WorkInfoEntity();
        workInfo.setRequestTime(LocalDateTime.now());
        workInfo.setCarState(entranceNode);   // 🔥 핵심
        workInfo.setImage(image);

        workInfoRepository.save(workInfo);
    }

    @Override
    public List<WorkInfoEntity> findAll() {
        return workInfoRepository.findAll();
    }

    @Override
    public List<WorkInfoEntity> findAllToday() {
        LocalDate today = LocalDate.now();
        return workInfoRepository.findAll().stream()
                .filter(w -> w.getRequestTime() != null &&
                        w.getRequestTime().toLocalDate().isEqual(today))
                .toList();
    }

    @Override
    public ImageEntity save(ImageEntity image) {
        return imageRepository.save(image);
    }

//    @Override
//    public ImageEntity findById(Long imageId) {
//        return imageRepository.findById(imageId)
//                .orElseThrow(() -> new IllegalArgumentException("이미지 없음"));
//    }

    @Override
    public ImageEntity findLatest() {
        return imageRepository
                .findTopByOrderByRegDateDesc()
                .orElse(null);
    }



//    @Override
//    public Optional<WorkInfoEntity> findLatestEntranceWithImage() {
//        return workInfoRepository
//                .findTopByImageIsNotNullOrderByRequestTimeDesc();
//    }
    @Override
    public Optional<WorkInfoEntity> findLatestEntranceWork() {
        return workInfoRepository.findTopByWork_WorkIdOrderByRequestTimeDesc(1);
    }

    @Override
    public List<WorkInfoEntity> findEntryBetween(LocalDateTime start, LocalDateTime end) {
        return workInfoRepository.findByEntryTimeBetween(start, end);
    }

    @Override
    public List<WorkInfoEntity> findExitBetween(LocalDateTime start, LocalDateTime end) {
        return workInfoRepository.findByExitTimeBetween(start, end);
    }

    public Optional<WorkInfoEntity> findCurrentEntranceCar(int nodeId) {

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        return workInfoRepository
                .findTopByCarState_NodeIdAndRequestTimeBetweenOrderByRequestTimeDesc(
                        nodeId,
                        start,
                        end
                );

    }

    @Override
    public ParkingMapNodeEntity findParkingNode(int nodeId) {
        return parkingMapNodeRepository.findByNodeId(nodeId)
                .orElseThrow(() -> new IllegalStateException("노드 없음"));
    }

    @Override
    public WorkInfoEntity findById(Long workId) {
        return workInfoRepository.findById(workId)
                .orElseThrow(() -> new IllegalStateException("work_info 없음"));
    }

    @Override
    public WorkInfoEntity save(WorkInfoEntity workInfo) {
        return workInfoRepository.save(workInfo);
    }
//    @Override
//    public Optional<WorkInfoEntity> findByImageId(Long imageId) {
//        return workInfoRepository
//                .findTopByImage_ImageIdOrderByRequestTimeDesc(imageId);
//    }
}
