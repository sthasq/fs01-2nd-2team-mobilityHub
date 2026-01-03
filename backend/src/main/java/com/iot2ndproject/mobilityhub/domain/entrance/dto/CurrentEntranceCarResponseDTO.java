package com.iot2ndproject.mobilityhub.domain.entrance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CurrentEntranceCarResponseDTO {

    private Long workId;
    private Integer nodeId;
    private String nodeName;
    private String imagePath;
    private String carNumber;
    private LocalDateTime requestTime;
}
