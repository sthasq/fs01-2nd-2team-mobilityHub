// 유저 테이블

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.user.entity;

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
@Table(name = "userInfo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    private String userId; // 유저아이디

    @Column(nullable = false)
    private String userPassword; // 패스워드

    @Column(nullable = false)
    private String userName; // 유저이름

    @Column(nullable = false)
    private String phoneNumber; // 휴대폰번호

    @CreationTimestamp
    private LocalDateTime createDate; // 가입날짜

    // 회원가입시
    public UserEntity(String userId, String userPassword, String userName, String phoneNumber) {
        this.userId = userId;
        this.userPassword = userPassword;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
    }
}
