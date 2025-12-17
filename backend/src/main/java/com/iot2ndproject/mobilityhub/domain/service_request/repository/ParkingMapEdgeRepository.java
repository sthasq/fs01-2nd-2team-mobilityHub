package com.iot2ndproject.mobilityhub.domain.service_request.repository;

import com.iot2ndproject.mobilityhub.domain.service_request.entity.ParkingMapEdgeEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.ParkingMapNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParkingMapEdgeRepository extends JpaRepository<ParkingMapEdgeEntity, Integer> {

    List<ParkingMapEdgeEntity> findByFromNode(ParkingMapNodeEntity fromNode);
}
