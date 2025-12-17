package com.iot2ndproject.mobilityhub.domain.user.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;

import java.util.List;


public interface UserDAO {
    void create(UserEntity user);
    UserEntity findById(String userId);
    void save(UserEntity user);

    // 유저 전체 목록 불러오기
    List<UserEntity> findAll();
}
