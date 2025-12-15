package com.iot2ndproject.mobilityhub.domain.parking.service;

import com.iot2ndproject.mobilityhub.domain.parking.dao.ParkingDAO;
import com.iot2ndproject.mobilityhub.domain.parking.dto.ParkingDTO;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {
    private final ParkingDAO parkingDAO;
    private final ModelMapper modelMapper;

    @Override
    public List<ParkingDTO> getAllParkingSpots() {
        List<ParkingEntity> parkings = parkingDAO.findAll();
        return parkings.stream()
                .map(parking -> modelMapper.map(parking, ParkingDTO.class))
                .collect(Collectors.toList());
    }
}