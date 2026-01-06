package com.iot2ndproject.mobilityhub.domain.car.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;

import java.util.List;

public interface UserCarDAO {
    UserCarEntity findById(int id);
    List<UserCarEntity> findByUser_UserId(String userId);
    void save(UserCarEntity userCar);
    UserCarEntity findByCarNumber(String carNumber);
    List<UserCarEntity> findByUserId(String userId);
}
