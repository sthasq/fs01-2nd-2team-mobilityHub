package com.iot2ndproject.mobilityhub.domain.entrance.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkInfoResponseDTO {

    private Long workId;          // work_info PK
    private String carNumber;

    private LocalDateTime requestTime;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private String imagePath;
    private String cameraId;
}
