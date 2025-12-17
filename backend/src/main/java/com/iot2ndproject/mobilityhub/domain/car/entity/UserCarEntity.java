package com.iot2ndproject.mobilityhub.domain.car.entity;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_car")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCarEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @ToString.Exclude
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(cascade = CascadeType.ALL)
    @ToString.Exclude
    @JoinColumn(name = "car_id", nullable = false)
    private CarEntity car;
}