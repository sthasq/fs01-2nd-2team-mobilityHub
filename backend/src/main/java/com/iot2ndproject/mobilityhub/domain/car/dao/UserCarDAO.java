package com.iot2ndproject.mobilityhub.domain.car.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserCarDAO {
    UserCarEntity findById(long id);
    List<UserCarEntity> findByUser_UserId(String userId);
    void save(UserCarEntity userCar);
    UserCarEntity findByCarNumber(String carNumber);
    List<UserCarEntity> findByUserId(String userId);
    Optional<UserCarEntity> findById(Long userCarId);
    List<UserCarEntity> findAll();

}
