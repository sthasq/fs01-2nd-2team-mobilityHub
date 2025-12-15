package com.iot2ndproject.mobilityhub.domain.work.dao;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

import java.util.List;

public interface WorkListDAO {

    // 전체목록 조회
    List<WorkInfoEntity> findAll();

    // 오늘 작업목록만 조회
    List<WorkInfoEntity> findAllToday();
}
