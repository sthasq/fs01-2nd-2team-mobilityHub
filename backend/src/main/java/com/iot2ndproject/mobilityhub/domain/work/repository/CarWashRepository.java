package com.iot2ndproject.mobilityhub.domain.work.repository;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarWashRepository extends JpaRepository<WorkInfoEntity, Long> {
    
    // workId로 조회하기
    List<WorkInfoEntity> findByWork_WorkId(int workId);

}
