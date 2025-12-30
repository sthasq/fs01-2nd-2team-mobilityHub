package com.iot2ndproject.mobilityhub.domain.service_request.repository;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryViewDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkInfoRepository extends JpaRepository<WorkInfoEntity, Long> {

    boolean existsByImage_ImageId(Long imageId);

    // 최근 입차 (workId = 1)
    Optional<WorkInfoEntity>
    findTopByWork_WorkIdOrderByRequestTimeDesc(Integer workId);

    // 금일 입차
    List<WorkInfoEntity>
    findByEntryTimeBetween(LocalDateTime start, LocalDateTime end);

    // 금일 출차
    List<WorkInfoEntity>
    findByExitTimeBetween(LocalDateTime start, LocalDateTime end);

    List<WorkInfoEntity> findAll();

    List<WorkInfoEntity> findByUserCar_User_UserIdAndWorkIsNotNullOrderByRequestTimeDesc(String userId);

    // carNumber로 진행 중인 최신 작업 정보 조회 (work_id가 null이 아닌 것만)
    Optional<WorkInfoEntity> findTopByUserCar_Car_CarNumberAndWorkIsNotNullOrderByRequestTimeDesc(String carNumber);

    Optional<EntranceEntryView> findTopByImageIsNotNullOrderByRequestTimeDesc();

    boolean existsByImage_ImageId(Integer imageId);

    // 오늘 들어온 요청만 리스트로 만들기
    // 이거 사용하려면 service단에서 start와 end 선언해야함
    List<WorkInfoEntity> findByRequestTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );


}

