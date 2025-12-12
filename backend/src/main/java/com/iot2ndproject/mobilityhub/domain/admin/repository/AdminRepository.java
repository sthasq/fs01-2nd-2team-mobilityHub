package com.iot2ndproject.mobilityhub.domain.admin.repository;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<AdminEntity, String> {

    // adminId로 관리자 조회
    AdminEntity findByAdminId(String adminId);
}
