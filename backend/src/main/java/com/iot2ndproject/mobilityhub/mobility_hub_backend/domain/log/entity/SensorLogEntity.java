// 센서 로그 - 모든 사용중인 센서에 대한 로그

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.log.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensorLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorLogEntity {
    public enum RoleType{ // 로그 심각도 조건 정의
        INFO, WARN, ERROR
    }

    @Id
    private Long logId; // 로그 고유 번호

    @Column(length = 50)
    private String sensorType; // 센서 종류(ultrasonic, camera, temp 등)

    @Column(length = 100)
    private RoleType level; // 측정된 값(거리, 번호판 텍스트 등)

    @Column(length = 100)
    private String deviceId; // 어떤 디바이스에서 들어온 값인지

    @CreationTimestamp
    private LocalDateTime createDate; // 기록 시간
}
