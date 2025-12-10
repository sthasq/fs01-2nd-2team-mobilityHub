package com.iot2ndproject.mobilityhub.domain.user.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserResponseDTO {
    private String username; // 유저아이디
    private String userPassword; // 패스워드
    private String userName; // 유저이름
    private String phoneNumber; // 휴대폰번호
    private String role;
}
