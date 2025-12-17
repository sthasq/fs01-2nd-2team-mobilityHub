package com.iot2ndproject.mobilityhub.domain.entrance.repository;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    ImageEntity findTopByOrderByRegDateDesc();
}