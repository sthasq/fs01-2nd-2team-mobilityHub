package com.iot2ndproject.mobilityhub.domain.repair.repository;

import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<ReportEntity, String> {

    // 보고서 아이디 찾기
    ReportEntity findByReportId(String reportId);

    // 보고서 삭제
    void deleteByReportId(String reportId);
}
