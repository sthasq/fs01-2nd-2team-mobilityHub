// 차정보 테이블

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.vehicle.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.user.entity.UserEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "car")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId; // 차 ID

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    private UserEntity user;

    @Column(nullable = false)
    private String carNumber; // 차번호
    
    @CreationTimestamp
    private LocalDateTime insertDate; // 차 등록날짜

    // 차정보 추가할때
    public CarEntity(UserEntity user, String carNumber){
        this.user = user;
        this.carNumber = carNumber;
    }
}
