package com.iot2ndproject.mobilityhub.domain.car.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CarDAOImpl implements CarDAO{
    private final CarRepository carRepository;
    @Override
    public void save(CarEntity car) {
        carRepository.save(car);
    }

    @Override
    public CarEntity findByCarNumber(String carNumber) {
        return carRepository.findByCarNumber(carNumber).get();
    }
}
