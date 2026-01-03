package com.iot2ndproject.mobilityhub.domain.entrance.dto;

import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkInfoTotalListResponse {
    private String id;
    private String carNumber;
    private String userName;
    private int carState;
    private String sectorId;
    private int workId;
    private LocalDateTime request_time;
    private LocalDateTime entry_time;
    private LocalDateTime exit_time;


}
