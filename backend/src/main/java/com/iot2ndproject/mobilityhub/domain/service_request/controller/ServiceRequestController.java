package com.iot2ndproject.mobilityhub.domain.service_request.controller;

import com.iot2ndproject.mobilityhub.domain.service_request.dto.ServiceRequestDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.service.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/service-request")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    @PostMapping
    public ResponseEntity<?> createServiceRequest(@RequestBody ServiceRequestDTO dto) {
        try {
            ServiceRequestDTO created = serviceRequestService.create(dto);

            // MQTT 경로 명령 발행
            try {
                serviceRequestService.publishRouteCommand(created);
            } catch (Exception mqttEx) {
                System.err.println("MQTT publish 실패: " + mqttEx.getMessage());
                // MQTT 실패는 서비스 요청 성공 자체에 영향 주지 않음
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage(), "class", e.getClass().getSimpleName()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequestDTO>> getServiceHistory(@RequestParam("userId") String userId) {
        try {
            List<ServiceRequestDTO> history = serviceRequestService.getHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<ServiceRequestDTO> getLatestServiceRequest(@RequestParam("userId") String userId) {
        try {
            Optional<ServiceRequestDTO> latest = serviceRequestService.getLatest(userId);
            return latest.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.noContent().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/status")
    public ResponseEntity<?> updateServiceStatus(
            @RequestParam Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "service", required = false) String service) {
        try {
            boolean updated = serviceRequestService.updateStatus(id, status, service);
            if (updated) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 유저 차량 호출 API
     * POST /service-request/{workInfoId}/call
     * 
     * @param workInfoId 작업 정보 ID
     * @return 성공 여부
     */
    @PostMapping("/{workInfoId}/call")
    public ResponseEntity<?> callVehicle(@PathVariable Long workInfoId) {
        try {
            Map<String, Object> result = serviceRequestService.callVehicle(workInfoId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

