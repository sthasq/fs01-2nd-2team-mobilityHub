package com.iot2ndproject.mobilityhub.domain.vehicle.dao;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;

public interface UserCarDAO {
    void save(UserCarEntity userCar);
    UserCarEntity findByCarNumber(String carNumber);
    UserCarEntity findByUserNumber(String userNumber);
}
