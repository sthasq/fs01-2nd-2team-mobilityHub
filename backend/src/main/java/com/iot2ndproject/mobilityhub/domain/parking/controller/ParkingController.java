// ParkingController.java
package com.iot2ndproject.mobilityhub.domain.parking.controller;

import com.iot2ndproject.mobilityhub.domain.parking.dto.ParkingDTO;
import com.iot2ndproject.mobilityhub.domain.parking.dao.ParkingDAOImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/parking")
@CrossOrigin(origins = {"http://localhost:5176", "http://localhost:5173"})
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingDAOImpl parkingDAO;

    @GetMapping("/list")
    public List<ParkingDTO> getParkingList() {
        return parkingDAO.findAllDto();
    }
}
