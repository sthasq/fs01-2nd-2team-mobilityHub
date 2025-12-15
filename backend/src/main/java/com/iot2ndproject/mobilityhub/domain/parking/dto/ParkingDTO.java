// ParkingDTO.java
package com.iot2ndproject.mobilityhub.domain.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParkingDTO {
    private String sectorId;
    private String sectorName;
    private String state;
    private String adminId;
}
