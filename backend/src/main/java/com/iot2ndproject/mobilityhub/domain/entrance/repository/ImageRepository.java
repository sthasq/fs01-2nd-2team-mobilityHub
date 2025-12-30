package com.iot2ndproject.mobilityhub.domain.entrance.repository;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {

    Optional<ImageEntity> findTopByOrderByRegDateDesc();
}