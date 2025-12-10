package com.iot2ndproject.mobilityhub.domain.user.service;

import com.iot2ndproject.mobilityhub.domain.user.dao.UserDAO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserRequestDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserResponseDTO;
import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final ModelMapper modelMapper;
    private final UserDAO userDAO;
    private final PasswordEncoder encoder;
    @Override
    public void write(UserRequestDTO user) {
        user.setPassword(encoder.encode(user.getPassword()));
        UserEntity entity = modelMapper.map(user, UserEntity.class);
        System.out.println(entity);
        userDAO.save(entity);
    }
}
