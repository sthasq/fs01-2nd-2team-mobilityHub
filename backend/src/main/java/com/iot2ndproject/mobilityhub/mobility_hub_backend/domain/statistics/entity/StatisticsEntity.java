// 통계 테이블

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.statistics.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "statistics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsEntity {
    @Id
    private int statisticsId; // 통계 ID

    private String sttCategory; // 유형(일/주/월별 방문횟수/정산내역)

    private int sttData; // 수치(count/sum)
}
