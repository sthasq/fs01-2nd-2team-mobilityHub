package com.iot2ndproject.mobilityhub.domain.entrance.dao;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.util.List;

public interface EntranceDAO {

    // 전체목록 조회
    List<WorkInfoEntity> findAll();

    // 오늘 작업목록만 조회
    List<WorkInfoEntity> findAllToday();

//    ================================================================
//    ImageDAO 파일 병합
//    ================================================================

    ImageEntity save(ImageEntity image);

    ImageEntity findById(Long imageId);

    ImageEntity findLatest();
}
