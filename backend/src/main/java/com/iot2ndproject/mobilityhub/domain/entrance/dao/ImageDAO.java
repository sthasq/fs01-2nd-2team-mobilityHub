package com.iot2ndproject.mobilityhub.domain.entrance.dao;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;

public interface ImageDAO {
    ImageEntity save(ImageEntity image);

    ImageEntity findById(Long imageId);
    
    ImageEntity findLatest();
}
