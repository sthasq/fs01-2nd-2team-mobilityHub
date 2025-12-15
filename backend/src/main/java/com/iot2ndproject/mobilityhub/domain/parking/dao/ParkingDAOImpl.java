// ParkingDAOImpl.java
package com.iot2ndproject.mobilityhub.domain.parking.dao;

import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.dto.ParkingDTO;
import com.iot2ndproject.mobilityhub.domain.parking.repository.ParkingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ParkingDAOImpl implements ParkingDAO {

    private final ParkingRepository parkingRepository;

    @Override
    public ParkingEntity findById(String id) {
        return parkingRepository.findById(id).orElse(null);
    }

    @Override
    public void save(ParkingEntity parking) {
        parkingRepository.save(parking);
    }

    @Override
    public void delete(String id) {
        parkingRepository.deleteById(id);
    }

    @Override
    public java.util.List<ParkingEntity> findAll() {
        return parkingRepository.findAll();
    }

    // ✅ DTO 변환 메서드 추가
    public List<ParkingDTO> findAllDto() {
        return parkingRepository.findAll().stream()
                .map(entity -> ParkingDTO.builder()
                        .sectorId(entity.getSectorId())
                        .sectorName(entity.getSectorName())
                        .state(entity.getState())
                        .build())
                .collect(Collectors.toList());
    }
}
