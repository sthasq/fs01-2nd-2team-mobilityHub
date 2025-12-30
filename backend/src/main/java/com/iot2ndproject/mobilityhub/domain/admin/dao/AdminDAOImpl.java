package com.iot2ndproject.mobilityhub.domain.admin.dao;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.admin.repository.AdminRepository;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.car.repository.UserCarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminDAOImpl implements AdminDAO {
    private final AdminRepository adminRepository;
    private final UserCarRepository userCarRepository;

    @Override
    public List<AdminEntity> findAll() {
        return adminRepository.findAll();
    }

    @Override
    public AdminEntity findByAdminId(String adminId) {
        return adminRepository.findByAdminId(adminId);
    }

    @Override
    public AdminEntity updateAdminInfo(AdminEntity admin) {
        return adminRepository.save(admin);
    }

    @Override
    public void updatePassword(String adminId, String encodedPass) {
        AdminEntity entity = adminRepository.findByAdminId(adminId);
        entity.setAdminPass(encodedPass);
        adminRepository.save(entity);
    }

    @Override
    public AdminEntity save(AdminEntity entity){
        return adminRepository.save(entity);
    }



        @Override
        public List<UserCarEntity> findAllRegisteredCars() {
            return userCarRepository.findAll();
        }
    }


