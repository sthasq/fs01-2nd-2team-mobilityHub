package com.iot2ndproject.mobilityhub.domain.entrance.dao;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.repository.ImageRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EntranceDAOImpl implements EntranceDAO {
    private final WorkInfoRepository repository;
    private final ImageRepository imageRepository;

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

    @Override
    public ImageEntity save(ImageEntity image) {
        return imageRepository.save(image);
    }

    @Override
    public ImageEntity findById(Long imageId) {
        return imageRepository.findById((imageId))
                .orElseThrow(() -> new IllegalArgumentException("이미지 없음"));
    }

    @Override
    public ImageEntity findLatest() {
        return null;
    }
}
