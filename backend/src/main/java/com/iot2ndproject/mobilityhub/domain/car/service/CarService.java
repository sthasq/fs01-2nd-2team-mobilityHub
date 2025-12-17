package com.iot2ndproject.mobilityhub.domain.car.service;

import com.iot2ndproject.mobilityhub.domain.car.dto.UserCarRequestDTO;

import java.util.List;

public interface CarService {

    void registerCar(UserCarRequestDTO userCarRequestDTO);

    List<String> findCarNumbersByUser(String userId);
}
