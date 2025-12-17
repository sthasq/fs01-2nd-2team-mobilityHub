package com.iot2ndproject.mobilityhub.domain.service_request.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestDAO {
    WorkInfoEntity save(WorkInfoEntity entity);
    List<WorkInfoEntity> saveAll(Iterable<WorkInfoEntity> entities);
    Optional<WorkInfoEntity> findById(Long id);
    List<WorkInfoEntity> findByUserIdOrderByRequestTimeDesc(String userId);
    Optional<UserCarEntity> findByUser_UserIdAndCar_CarNumber(String userId, String carNumber);
    Optional<WorkEntity> findWorkById(int workId);
}
