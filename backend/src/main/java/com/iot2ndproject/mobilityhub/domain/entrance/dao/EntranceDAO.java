package com.iot2ndproject.mobilityhub.domain.entrance.dao;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.ParkingMapNodeEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EntranceDAO {

    // Image
    ImageEntity save(ImageEntity image);

    ImageEntity findLatest();


    // WorkInfo
    Optional<WorkInfoEntity> findLatestEntranceWork(); // workId=1
    List<WorkInfoEntity> findEntryBetween(LocalDateTime start, LocalDateTime end);
    List<WorkInfoEntity> findExitBetween(LocalDateTime start, LocalDateTime end);
//    Optional<WorkInfoEntity> findByImageId(Long imageId);
//    Optional<WorkInfoEntity> findLatestEntranceWithImage();
    // List
    Optional<WorkInfoEntity> findCurrentEntranceCar(int nodeId);
    ParkingMapNodeEntity findParkingNode(int nodeId);
    WorkInfoEntity findById(Long workId);



    WorkInfoEntity save(WorkInfoEntity workInfo);
    @Transactional
    void createEntranceWorkInfo(ImageEntity image);

    List<WorkInfoEntity> findAll();
    List<WorkInfoEntity> findAllToday(); // 파생메서드가 애매해서 DAO에서 필터링

}
