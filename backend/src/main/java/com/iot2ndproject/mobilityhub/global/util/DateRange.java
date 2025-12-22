package com.iot2ndproject.mobilityhub.global.util;

import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
public class DateRange {
    public static LocalDateTime todayStart() {
        return LocalDate.now().atStartOfDay();
    }

    public static LocalDateTime tomorrowStart() {
        return LocalDate.now().plusDays(1).atStartOfDay();
    }
}
