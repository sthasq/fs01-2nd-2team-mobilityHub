package com.iot2ndproject.mobilityhub.domain.vehicle.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCarRequestDTO {
    private String carNumber;
    private String carModel;
    private String userId;
}
