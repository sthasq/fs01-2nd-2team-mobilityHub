import React, { useState, useEffect } from "react";
import { User, Lock, Save } from "lucide-react";
import "../style/ProfileSection.css";

export function ProfileSection() {
  const [adminData, setAdminData] = useState({
    adminId: "",
    adminName: "",
    adminPass: "",
  });

  const [formData, setFormData] = useState({
    adminName: "",
    adminPass: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ✅ 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // ✅ GET /api/admin/{adminId}
  const fetchAdminProfile = async () => {
    try {
      setLoading(true);

      // ✅ localStorage에서 adminId 가져오기
      const adminId = localStorage.getItem("adminId") || "Padmin";

      console.log("📌 요청 ID:", adminId);
      console.log("📌 요청 URL:", `http://localhost:9000/admin/${adminId}`);

      // ✅ API 요청
      const response = await fetch(
        `http://localhost:9000/admin/${adminId}`
      );

      console.log("📌 응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("📌 에러 응답:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      console.log("✅ 받은 데이터:", data);

      // ✅ 데이터 설정
      setAdminData(data);
      setFormData({
        adminName: data.adminName || "",
        adminPass: data.adminPass || "",
      });

      setMessage("✅ 프로필을 성공적으로 불러왔습니다");
      setMessageType("success");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ 프로필 조회 실패:", error);

      setMessage(`❌ 프로필을 불러올 수 없습니다: ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 입력값 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 정보 수정 - PUT 요청
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!formData.adminName.trim()) {
      setMessage("❌ 이름을 입력해주세요");
      setMessageType("error");
      return;
    }

    try {
      console.log("📌 PUT 요청:", {
        url: `http://localhost:9000/admin/${adminData.adminId}`,
        body: {
          adminId: adminData.adminId,
          adminName: formData.adminName,
          adminPass: formData.adminPass,
        },
      });

      const response = await fetch(
        `http://localhost:9000/admin/${adminData.adminId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminId: adminData.adminId,
            adminName: formData.adminName,
            adminPass: formData.adminPass,
          }),
        }
      );

      console.log("📌 응답 상태:", response.status);

      if (!response.ok) {
        throw new Error("정보 수정 실패");
      }

      const updatedData = await response.json();

      console.log("✅ 업데이트된 데이터:", updatedData);

      setAdminData(updatedData);
      setFormData({
        adminName: updatedData.adminName,
        adminPass: updatedData.adminPass,
      });

      setMessage("✅ 정보가 성공적으로 수정되었습니다");
      setMessageType("success");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ 정보 수정 실패:", error);
      setMessage("❌ 정보 수정 실패: " + error.message);
      setMessageType("error");
    }
  };

  // ✅ 비밀번호 변경 - PUT 요청
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage("❌ 새 비밀번호를 입력해주세요");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 4) {
      setMessage("❌ 비밀번호는 4자 이상이어야 합니다");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ 비밀번호가 일치하지 않습니다");
      setMessageType("error");
      return;
    }

    try {
      console.log("📌 비밀번호 변경 요청:", {
        url: `http://localhost:9000/admin/${adminData.adminId}`,
        body: {
          adminId: adminData.adminId,
          adminName: adminData.adminName,
          adminPass: newPassword,
        },
      });

      const response = await fetch(
        `http://localhost:9000/admin/${adminData.adminId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminId: adminData.adminId,
            adminName: adminData.adminName,
            adminPass: newPassword,
          }),
        }
      );

      console.log("📌 응답 상태:", response.status);

      if (!response.ok) {
        throw new Error("비밀번호 변경 실패");
      }

      const updatedData = await response.json();

      console.log("✅ 비밀번호 변경됨:", updatedData);

      setAdminData(updatedData);
      setFormData((prev) => ({
        ...prev,
        adminPass: newPassword,
      }));

      setNewPassword("");
      setConfirmPassword("");

      setMessage("✅ 비밀번호가 성공적으로 변경되었습니다");
      setMessageType("success");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ 비밀번호 변경 실패:", error);
      setMessage("❌ 비밀번호 변경 실패: " + error.message);
      setMessageType("error");
    }
  };

  // ✅ 로딩 중
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">프로필 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ✅ 메시지 표시 */}
      {message && (
        <div
          className={`p-4 rounded-lg font-medium ${
            messageType === "success"
              ? "bg-green-100 border border-green-400 text-green-800"
              : "bg-red-100 border border-red-400 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* ✅ 프로필 헤더 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {adminData.adminName}
          </h1>
          <p className="text-gray-500 mt-1">ID: {adminData.adminId}</p>
          <p className="text-gray-400 text-sm mt-1">시설관리팀</p>
        </div>
      </div>

      {/* ✅ 기본 정보 & 비밀번호 변경 (2열) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============ 기본 정보 수정 ============ */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            {/* 관리자 ID (읽기 전용) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                관리자 ID
              </label>
              <input
                type="text"
                value={adminData.adminId}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
              />
              <p className="text-gray-500 text-sm mt-1">변경할 수 없습니다</p>
            </div>

            {/* 관리자 이름 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                관리자 이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            {/* 저장 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 duration-200"
            >
              <Save className="w-5 h-5" />
              정보 저장
            </button>
          </form>
        </div>

        {/* ============ 비밀번호 변경 ============ */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              비밀번호 변경
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            {/* 새 비밀번호 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                새 비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            {/* 비밀번호 규칙 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                ✓ 최소 4자 이상이어야 합니다
              </p>
            </div>

            {/* 비밀번호 변경 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 duration-200"
            >
              <Lock className="w-5 h-5" />
              비밀번호 변경
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
