package com.iot2ndproject.mobilityhub.domain.admin.controller;

import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminPassChangeRequest;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminResponseDTO;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminUpdateRequest;
import com.iot2ndproject.mobilityhub.domain.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // GET : 관리자 전체조회
    @GetMapping("/list")
    public List<AdminResponseDTO> getAllAdmins() {
        return adminService.adminList();
    }

    // GET: 관리자 정보 조회
    @GetMapping("/info")
    public AdminResponseDTO getMyInfo(@RequestParam(name = "adminId") String adminId) {
        return adminService.getAdminInfo(adminId);
    }

    // POST: 관리자 정보 수정
    @PostMapping("/update")
    public AdminResponseDTO updateAdmin(@RequestParam(name = "adminId") String adminId, @RequestBody AdminUpdateRequest request) {
        return adminService.updateInfo(adminId, request);
    }

    // POST: 비밀번호 변경
    @PostMapping("/password")
    public String changePassword( @RequestParam(name = "adminId") String adminId, @RequestBody AdminPassChangeRequest request) {
        adminService.changePassword(adminId, request);
        return "비밀번호가 변경되었습니다.";
    }

    @PostMapping("/bcryptpass")
    public ResponseEntity<String> updatePassword(
            @RequestParam String adminId,
            @RequestBody Map<String, String> body
    ) {
        String newPassword = body.get("newPassword");

        adminService.updatePassword(adminId, newPassword);

        return ResponseEntity.ok("비밀번호 변경 완료");
    }


}
