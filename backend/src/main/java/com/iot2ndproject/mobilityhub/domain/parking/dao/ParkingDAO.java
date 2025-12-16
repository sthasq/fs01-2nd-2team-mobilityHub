package com.iot2ndproject.mobilityhub.domain.parking.dao;

import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import java.util.List;

public interface ParkingDAO {
    ParkingEntity findById(String id);  // ✅ int → String
    void save(ParkingEntity parking);
    void delete(String id);  // ✅ int → String
    List<ParkingEntity> findAll();
}
