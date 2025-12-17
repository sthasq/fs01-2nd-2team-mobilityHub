package com.iot2ndproject.mobilityhub.domain.user.repository;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity,String> {
}
