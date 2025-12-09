// 작업정보 테이블

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.work.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "work")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int workId; // 작업번호

    @Column(nullable = false)
    private String workType;    // 작업명

    // 작업정보 새로 또는 추가로 추가시
    public WorkEntity(String workType){
        this.workType = workType;
    }
}
