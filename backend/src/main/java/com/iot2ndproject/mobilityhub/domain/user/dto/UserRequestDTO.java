package com.iot2ndproject.mobilityhub.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserRequestDTO {
    private String userId;
    private String password;
    private String userName;
    private String tel;
    private String role;
}