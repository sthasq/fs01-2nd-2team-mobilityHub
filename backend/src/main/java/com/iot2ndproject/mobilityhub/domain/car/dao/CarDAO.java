package com.iot2ndproject.mobilityhub.domain.car.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;

public interface CarDAO {
    void save(CarEntity car);
    CarEntity findByCarNumber(String carNumber);
}
