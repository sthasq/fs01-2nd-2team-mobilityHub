package com.iot2ndproject.mobilityhub.domain.car.controller;

import com.iot2ndproject.mobilityhub.domain.car.dto.UserCarRequestDTO;
import com.iot2ndproject.mobilityhub.domain.car.service.CarServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/car")
@RequiredArgsConstructor
public class CarController {
    private final CarServiceImpl carService;

    @PostMapping("/save")
    public ResponseEntity<?> saveCar(@RequestBody UserCarRequestDTO userCarRequestDTO){
        try {
            carService.registerCar(userCarRequestDTO);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", e.getMessage(),
                    "class", e.getClass().getSimpleName()
            ));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listByUser(@RequestParam("userId") String userId){
        try {
            return ResponseEntity.ok(carService.findCarNumbersByUser(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
