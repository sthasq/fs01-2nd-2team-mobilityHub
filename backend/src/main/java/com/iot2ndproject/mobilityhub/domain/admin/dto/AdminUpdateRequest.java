package com.iot2ndproject.mobilityhub.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 관리자 정보 변경을 위한 Request

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateRequest {
    private String adminName;
    private String email;
    private String phone;
}
