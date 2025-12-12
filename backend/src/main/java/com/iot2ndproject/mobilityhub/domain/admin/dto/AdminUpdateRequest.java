package com.iot2ndproject.mobilityhub.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateRequest {
    private String adminName;
    private String email;
    private String phone;
}
