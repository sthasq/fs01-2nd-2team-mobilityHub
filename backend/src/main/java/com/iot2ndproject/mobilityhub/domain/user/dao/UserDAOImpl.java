package com.iot2ndproject.mobilityhub.domain.user.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserDAOImpl implements UserDAO{
    private final UserRepository userRepository;
    @Override
    public void save(UserEntity user) {
        userRepository.save(user);
    }

    @Override
    public UserEntity findByUsername(String username) {
        return null;
    }
}
