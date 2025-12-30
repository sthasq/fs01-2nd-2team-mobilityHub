package com.iot2ndproject.mobilityhub.domain.admin.dao;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;

import java.util.List;

public interface AdminDAO {

    // 전체 관리자 목록 조회
    List<AdminEntity> findAll();

    AdminEntity findByAdminId(String adminId);

    AdminEntity updateAdminInfo(AdminEntity admin);

    void updatePassword(String adminId, String encodedPass);

    // 임시로 만들어둠(비밀번호만 암호화한 상태로 변경시키기)
    AdminEntity save(AdminEntity admin);


}
