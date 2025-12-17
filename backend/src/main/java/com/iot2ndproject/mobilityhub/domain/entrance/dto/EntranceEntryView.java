package com.iot2ndproject.mobilityhub.domain.entrance.dto;

import java.time.LocalDateTime;

public interface EntranceEntryView {

    // work_info
    Long getId();
    LocalDateTime getRequestTime();
    LocalDateTime getEntryTime();
    LocalDateTime getExitTime();

    // user_car → car
    String getUserCar_Car_CarNumber();

    // image
    Integer getImage_ImageId();
    String getImage_ImagePath();
    String getImage_CameraId();
    String getImage_OcrNumber();
    String getImage_CorrectedOcrNumber();
}
