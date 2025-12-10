// 유저 테이블

package com.iot2ndproject.mobilityhub.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.integration.annotation.Default;

import java.time.LocalDateTime;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    private String username; // 유저아이디

    @Column(nullable = false)
    private String password; // 패스워드

    @Column(nullable = false)
    private String name; // 이름

    @Column(nullable = false)
    private String tel; // 휴대폰번호

    @CreationTimestamp
    private LocalDateTime createDate; // 가입날짜

    @Column
    private String role;
    // 회원가입시
    public UserEntity(String username, String password, String name, String tel, String role) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.tel = tel;
        this.role = role;
    }
}
