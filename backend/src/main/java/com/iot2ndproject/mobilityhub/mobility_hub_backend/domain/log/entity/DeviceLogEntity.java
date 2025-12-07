// 디바이스 로그 - 라즈베리파이 부팅&통신&업데이트 등 관련된 로그

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.log.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deviceLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceLogEntity {
    public enum RoleType{ // 심각도 조건 정의
        INFO, WARN, ERROR
    }
    @Id
    private Long logId; // 로그 고유 번호

    @Column(length = 100)
    private String deviceId; // 라즈베리파이/기기 시리얼 번호

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private RoleType level; // 로그 심각도

    @Column(columnDefinition = "TEXT")
    private String message; // 부팅/통신/오류 등 상세 내용

    @CreationTimestamp
    private LocalDateTime createDate; // 로그 발생 시각


}
