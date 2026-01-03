package com.iot2ndproject.mobilityhub.domain.service_request.repository;

import com.iot2ndproject.mobilityhub.domain.service_request.entity.ParkingMapNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParkingMapNodeRepository extends JpaRepository<ParkingMapNodeEntity, Integer> {


    Optional<ParkingMapNodeEntity> findByNodeId(int nodeId);

}
