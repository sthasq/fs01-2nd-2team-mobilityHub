package com.iot2ndproject.mobilityhub.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredCarResponseDTO {
    private Long userCarId;
    private String userName;
    private String carNumber;

    public RegisteredCarResponseDTO(String userName, String carNumber, Long id) {
    }
}
