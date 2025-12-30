package com.iot2ndproject.mobilityhub.domain.service_request.service;

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
     * 서비스 타입에 따른 "초기" 노드 경로 반환
     * @param workType work.work_type (예: "park", "carwash", "park,carwash" 등)
     * @return 노드 ID 배열 (입구 1 → 1차 목적지에서 정지)
     */
    public List<Integer> calculateRoute(String workType) {
        if (workType == null || workType.isBlank()) {
            throw new IllegalArgumentException("workType is required");
        }

        String normalized = workType.trim().toLowerCase();

        // work.work_type별 고정 경로 (data.sql 기준)
        // - park: 주차 노드에서 "대기"(호출 신호를 기다림)
        // - carwash/repair: 해당 구역 노드에서 "대기"(서비스 완료 신호를 기다림)
        switch (normalized) {
            case "park":
                // 입구 → 주차(기본: 주차_1)에서 대기
                return calculateParkingRoute(5);

            case "carwash":
                // 입구 → 세차_1(10)에서 대기
                return Arrays.asList(1, 2, 10);

            case "repair":
                // 입구 → 정비_1(13)에서 대기
                return Arrays.asList(1, 2, 12, 13);

            case "park,carwash":
                // 1단계: 입구 → 세차_1(10)에서 대기 (완료 후 다음 경로는 별도 계산)
                return Arrays.asList(1, 2, 10);

            case "park,repair":
                // 1단계: 입구 → 정비_1(13)에서 대기 (완료 후 다음 경로는 별도 계산)
                return Arrays.asList(1, 2, 12, 13);

            default:
                throw new IllegalArgumentException("Unknown workType: " + workType);
        }
    }

    /**
     * 입구에서 특정 주차 노드까지의 경로 계산
     * @param parkingNodeId 주차 노드 ID (5/7/9)
     */
    public List<Integer> calculateParkingRoute(int parkingNodeId) {
        switch (parkingNodeId) {
            case 5: // 주차_1
                return Arrays.asList(1, 2, 3, 4, 5);
            case 7: // 주차_2
                return Arrays.asList(1, 2, 3, 4, 6, 7);
            case 9: // 주차_3
                return Arrays.asList(1, 2, 3, 4, 6, 8, 9);
            default:
                throw new IllegalArgumentException("Unknown parkingNodeId: " + parkingNodeId);
        }
    }

    /**
     * 서비스 완료(세차/정비) 이후 다음 목적지까지의 경로 계산
     * - park 포함: 주차 노드까지 이동 후 대기
     * - park 미포함: 출구까지 이동
     */
    public List<Integer> calculateNextRouteAfterService(String stage, boolean hasPark, int parkingNodeId) {
        if (stage == null || stage.isBlank()) {
            throw new IllegalArgumentException("stage is required");
        }

        String normalizedStage = stage.trim().toLowerCase();

        if ("carwash".equals(normalizedStage)) {
            if (hasPark) {
                // 세차_1(10) → ... → 기점_2(3) → 기점_3(4) → 주차_x
                return concat(Arrays.asList(10, 15, 17, 18, 3, 4), fromNode4ToParking(parkingNodeId));
            }
            // 세차_1(10) → ... → 출구(20)
            return Arrays.asList(10, 15, 17, 18, 19, 20);
        }

        if ("repair".equals(normalizedStage)) {
            if (hasPark) {
                // 정비_1(13) → ... → 기점_2(3) → 기점_3(4) → 주차_x
                return concat(Arrays.asList(13, 14, 17, 18, 3, 4), fromNode4ToParking(parkingNodeId));
            }
            // 정비_1(13) → ... → 출구(20)
            return Arrays.asList(13, 14, 17, 18, 19, 20);
        }

        throw new IllegalArgumentException("Unknown stage: " + stage);
    }

    private List<Integer> fromNode4ToParking(int parkingNodeId) {
        switch (parkingNodeId) {
            case 5:
                return Arrays.asList(5);
            case 7:
                return Arrays.asList(6, 7);
            case 9:
                return Arrays.asList(6, 8, 9);
            default:
                throw new IllegalArgumentException("Unknown parkingNodeId: " + parkingNodeId);
        }
    }

    private List<Integer> concat(List<Integer> a, List<Integer> b) {
        java.util.ArrayList<Integer> out = new java.util.ArrayList<>(a.size() + b.size());
        out.addAll(a);
        out.addAll(b);
        return out;
    }

    /**
     * 주차 노드에서 출구까지의 경로 계산
     * @param currentNodeId 현재 노드 ID (주차 노드: 5, 7, 9 등)
     * @return 출구(20)까지의 노드 ID 배열
     */
    public List<Integer> calculateExitRoute(int currentNodeId) {
        // 주차 노드별 출구 경로
        switch (currentNodeId) {
            case 5: // 주차_1
                return Arrays.asList(5, 23, 18, 19, 20);
            case 7: // 주차_2
                return Arrays.asList(7, 22, 18, 19, 20);
            case 9: // 주차_3
                return Arrays.asList(9, 21, 18, 19, 20);
            default:
                throw new IllegalArgumentException("주차 구역이 아닌 노드에서는 호출할 수 없습니다. 현재 노드 ID: " + currentNodeId);
        }
    }
}
