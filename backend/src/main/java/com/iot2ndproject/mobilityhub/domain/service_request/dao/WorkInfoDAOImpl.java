package com.iot2ndproject.mobilityhub.domain.service_request.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * WorkInfoDAO 구현체
 * - Repository만 사용
 * - Service에서 Repository 직접 접근 금지
 */
@Repository
@RequiredArgsConstructor
public class WorkInfoDAOImpl implements WorkInfoDAO {

    private final WorkInfoRepository workInfoRepository;

    /**
     * 이미지 기준 중복 매칭 방지
     */
    @Override
    public boolean existsByImageId(Long imageId) {
        return workInfoRepository.existsByImage_ImageId(imageId);
    }

    /**
     * WorkInfo 저장
     */
    @Override
    public WorkInfoEntity save(WorkInfoEntity workInfo) {
        return workInfoRepository.save(workInfo);
    }

    @Override
    public List<WorkInfoEntity> findByEntryTimeIsNotNullAndEntryTimeBetween(LocalDateTime start, LocalDateTime end) {
        return workInfoRepository
                .findByEntryTimeIsNotNullAndEntryTimeBetween(start, end);
    }

    /**
     * workInfoId로 단건 조회
     */
    @Override
    public Optional<WorkInfoEntity> findById(Long workInfoId) {
        return workInfoRepository.findById(workInfoId);
    }




    /**
     * 전체 작업 목록 조회
     */
    @Override
    public List<WorkInfoEntity> findAll() {
        return workInfoRepository.findAll();
    }

    @Override
    public boolean existsByUserCarAndEntryTimeBetween(UserCarEntity userCar, LocalDateTime localDateTime, LocalDateTime localDateTime1) {
        return false;
    }

    @Override
    public List<WorkInfoEntity> findByEntryTimeBetween(LocalDateTime start, LocalDateTime end) {
        return List.of();
    }
}
