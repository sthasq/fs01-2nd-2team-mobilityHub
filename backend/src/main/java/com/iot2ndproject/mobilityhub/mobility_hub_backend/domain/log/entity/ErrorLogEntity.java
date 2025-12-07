// 에러관련 로그

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.log.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "errorLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorLogEntity {
    public enum RoleType{ // 오류 단계 조건 정의
        WARN, ERROR, CRITICAL
    }
    @Id
    private Long errorId; // 고유 로그 번호

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private RoleType level; // 오류 단계

    @Column(columnDefinition = "TEXT")
    private String message; // 오류 메세지

    @CreationTimestamp
    private LocalDateTime createDate; // 오류 발생시각

}
