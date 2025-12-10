package com.iot2ndproject.mobilityhub.domain.user.service;

import com.iot2ndproject.mobilityhub.domain.user.dto.UserRequestDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserResponseDTO;

public interface UserService {
    void write(UserRequestDTO user);
}
