package com.iot2ndproject.mobilityhub.domain.user.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class UserUserDetail extends User {
    private final UserResponseDTO responseDTO;

    public UserUserDetail(UserResponseDTO responseDTO, Collection<? extends GrantedAuthority> authorities) {
        super(responseDTO.getUserId().toString(), responseDTO.getPassword(),authorities);
        this.responseDTO = responseDTO;
    }
    public UserResponseDTO getResponseDTO(){
        return responseDTO;
    }
}
