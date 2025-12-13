package com.iot2ndproject.mobilityhub.domain.parkingmap.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * 서비스 타입(park/carwash/repair) 조합에 따라 노드 경로를 반환하는 서비스.
 * 현재는 하드코딩된 경로를 반환하며, 추후 parking_map_node/edge 기반으로 동적 계산 가능.
 */
@Service
public class RouteService {

    /**
     * 서비스 타입에 따른 노드 경로 반환
     * @param workType work.work_type (예: "park", "carwash", "park,carwash" 등)
     * @return 노드 ID 배열 (입구 1 → 서비스 구역 → 합류 → 출구 20)
     */
    public List<Integer> calculateRoute(String workType) {
        if (workType == null || workType.isBlank()) {
            throw new IllegalArgumentException("workType is required");
        }

        String normalized = workType.trim().toLowerCase();

        // work.work_type별 고정 경로 (data.sql 기준)
        switch (normalized) {
            case "park":
                // 입구 → 주차1 → 합류 → 출구
                return Arrays.asList(1, 2, 3, 4, 5, 23, 18, 19, 20);

            case "carwash":
                // 입구 → 세차 → 합류 → 출구
                return Arrays.asList(1, 2, 10, 15, 17, 18, 19, 20);

            case "repair":
                // 입구 → 정비 → 합류 → 출구
                return Arrays.asList(1, 2, 12, 13, 14, 17, 18, 19, 20);

            case "park,carwash":
                // 입구 → 세차 → 합류 → 주차1 → 합류 → 출구
                return Arrays.asList(1, 2, 10, 15, 17, 18, 3, 4, 5, 23, 18, 19, 20);

            case "park,repair":
                // 입구 → 정비 → 합류 → 주차1 → 합류 → 출구
                return Arrays.asList(1, 2, 12, 13, 14, 17, 18, 3, 4, 5, 23, 18, 19, 20);

            default:
                throw new IllegalArgumentException("Unknown workType: " + workType);
        }
    }
}
