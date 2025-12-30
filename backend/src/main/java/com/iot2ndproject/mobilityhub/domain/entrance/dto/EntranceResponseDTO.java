package com.iot2ndproject.mobilityhub.domain.entrance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntranceResponseDTO {

    private Long workId;
    private Long imageId;

    private String carNumber;

    private String imagePath;
    private String cameraId;

    private String ocrNumber;
    private String correctedOcrNumber;

    private LocalDateTime time;
    private boolean match;

    public void setApproved(boolean b) {
    }
}