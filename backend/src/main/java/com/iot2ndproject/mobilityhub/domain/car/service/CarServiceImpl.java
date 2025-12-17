package com.iot2ndproject.mobilityhub.domain.car.service;

import com.iot2ndproject.mobilityhub.domain.user.dao.UserDAO;
import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.car.dao.CarDAO;
import com.iot2ndproject.mobilityhub.domain.car.dao.UserCarDAO;
import com.iot2ndproject.mobilityhub.domain.car.dto.UserCarRequestDTO;
import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {
    private final CarDAO carDAO;
    private final UserDAO userDAO;
    private final UserCarDAO userCarDAO;

    @Transactional
    @Override
    public void registerCar(UserCarRequestDTO userCarRequestDTO) {

        // 1. 차량 생성 및 저장
        CarEntity car = new CarEntity(userCarRequestDTO.getCarNumber());
        carDAO.save(car);

        // 2. 유저 조회
        UserEntity user = userDAO.findById(userCarRequestDTO.getUserId());

        // 3. 유저-차량 관계 생성
        UserCarEntity userCar = UserCarEntity.builder()
            .user(user)
            .car(car)
            .build();
        userCarDAO.save(userCar);
    }

    @Override
    public List<String> findCarNumbersByUser(String userId){
        return userCarDAO.findByUserId(userId).stream()
                .map(UserCarEntity::getCar)
                .map(CarEntity::getCarNumber)
                .collect(Collectors.toList());
    }
}
