package com.iot2ndproject.mobilityhub.domain.car.repository;

import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserCarRepository extends JpaRepository<UserCarEntity,Long> {

    UserCarEntity findById(long id);

    List<UserCarEntity> findByUser_UserId(String userId);

    Optional<UserCarEntity> findByUser_UserIdAndCar_CarNumber(String userId, String carNumber);
    UserCarEntity findByCarCarNumber(String carNumber);
    List<UserCarEntity> findAll();
    Optional<UserCarEntity> findByCar_CarNumber(String carNumber);
}
