package com.iot2ndproject.mobilityhub.domain.car.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.car.repository.UserCarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserCarDAOImpl implements UserCarDAO{
    private final UserCarRepository userCarRepository;

    @Override
    public UserCarEntity findById(long id) {
        return userCarRepository.findById(id);
    }

    @Override
    public List<UserCarEntity> findByUser_UserId(String userId) {
        return List.of();
    }

    @Override
    public void save(UserCarEntity userCar) {
        userCarRepository.save(userCar);
    }

    @Override
    public UserCarEntity findByCarNumber(String carNumber) {
        return null;
    }

    @Override
    public List<UserCarEntity> findByUserId(String userId) {
        return userCarRepository.findByUser_UserId(userId);
    }

    @Override
    public Optional<UserCarEntity> findById(Long userCarId) {
        return userCarRepository.findById(userCarId);
    }

    @Override
    public List<UserCarEntity> findAll() {
        return userCarRepository.findAll();
    }


}
