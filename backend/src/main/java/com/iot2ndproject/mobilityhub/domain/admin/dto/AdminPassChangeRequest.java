package com.iot2ndproject.mobilityhub.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 관리자 비밀번호 변경을 위한 Request

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPassChangeRequest {
    private String currentPassword;
    private String newPassword;
}
