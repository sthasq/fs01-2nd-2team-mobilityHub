package com.iot2ndproject.mobilityhub.domain.service_request.repository;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkInfoRepository extends JpaRepository<WorkInfoEntity, Long> {

    List<WorkInfoEntity> findByUserCar_User_UserIdOrderByRequestTimeDesc(String userId);

    List<WorkInfoEntity> findAll();

    // carNumber로 최신 작업 정보 조회
    Optional<WorkInfoEntity> findTopByUserCar_Car_CarNumberOrderByRequestTimeDesc(String carNumber);

    List<WorkInfoEntity>
    findByUserCar_User_UserIdAndWorkIsNotNullOrderByRequestTimeDesc(String userId);
    // carNumber로 진행 중인 최신 작업 정보 조회 (work_id가 null이 아닌 것만)
    Optional<WorkInfoEntity> findTopByUserCar_Car_CarNumberAndWorkIsNotNullOrderByRequestTimeDesc(String carNumber);
    Optional<EntranceEntryView>
    findTopByImageIsNotNullOrderByRequestTimeDesc();
    boolean existsByImage_ImageId(Integer imageId);


    List<EntranceEntryView> findByEntryTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<EntranceEntryView> findByExitTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}
