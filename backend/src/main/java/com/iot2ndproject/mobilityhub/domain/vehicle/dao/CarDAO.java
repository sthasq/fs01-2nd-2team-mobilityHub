package com.iot2ndproject.mobilityhub.domain.vehicle.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;

public interface CarDAO {
    void save(CarEntity car);
    CarEntity findByCarNumber(String carNumber);
}
