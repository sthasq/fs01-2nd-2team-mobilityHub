package com.iot2ndproject.mobilityhub.domain.user.dto;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserResponseDTO {
    private String userId; // 유저아이디
    private String password; // 패스워드
    private String userName; // 유저이름
    private String tel; // 휴대폰번호
    private String role;
    private List<UserCarEntity> userCars;
}
