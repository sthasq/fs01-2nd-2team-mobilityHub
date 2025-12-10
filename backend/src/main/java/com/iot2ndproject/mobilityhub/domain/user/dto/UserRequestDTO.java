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
    private String username;
    private String password;
    private String name;
    private String tel;
    private String role;
}