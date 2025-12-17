package com.iot2ndproject.mobilityhub.domain.service_request.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ServiceRequestDTO {
    private Long id;
    private String userId;
    private String carNumber;
    private List<String> services;
    private String additionalRequest;
    private LocalDateTime createdAt;
    private String parkingStatus;
    private String carwashStatus;
    private String repairStatus;
    private String status;
    private String carState; // 차량 현재 위치 (노드 이름)
}

