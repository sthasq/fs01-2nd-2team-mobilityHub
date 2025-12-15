package com.iot2ndproject.mobilityhub.domain.work.dao;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WorkListDAOImpl implements WorkListDAO {
    private final WorkInfoRepository repository;

    @Override
    public List<WorkInfoEntity> findAll() {
        System.out.println("작업목록 조회");
        return repository.findAll();
    }

    @Override
    public List<WorkInfoEntity> findAllToday() {
        System.out.println("오늘 작업목록만 조회");
        return repository.findAll();
    }
}
