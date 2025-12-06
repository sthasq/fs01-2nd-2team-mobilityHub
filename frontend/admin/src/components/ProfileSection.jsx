import { useState } from "react";
import { User, Mail, Phone, Lock, Save } from "lucide-react";

export function ProfileSection() {
  // 기본 프로필 정보를 저장하는 상태
  const [formData, setFormData] = useState({
    name: "관리자",
    email: "admin@smartpark.com",
    phone: "010-1234-5678",
    department: "시설관리팀",
  });

  // 비밀번호 변경 입력값을 저장하는 상태
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 기본 정보 입력 변경 시 데이터를 업데이트하는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // name 속성에 맞는 값 업데이트
    }));
  };

  // 비밀번호 입력 변경 시 데이터를 업데이트하는 함수
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 기본 정보 저장 버튼 눌렀을 때 실행되는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    alert("정보가 수정되었습니다.");
  };

  // 비밀번호 변경 버튼 눌렀을 때 실행되는 함수
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // 새 비밀번호와 확인 비밀번호가 일치하는지 검사
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("비밀번호가 변경되었습니다.");

    // 비밀번호 입력값 초기화
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 프로필 상단 영역 (사진 + 기본 정보) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          {/* 프로필 아이콘 영역 */}
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>

          {/* 이름, 이메일, 부서 표시 */}
          <div>
            <h2 className="text-gray-900">{formData.name}</h2>
            <p className="text-gray-500 mt-1">{formData.email}</p>
            <p className="text-gray-400 text-sm mt-1">{formData.department}</p>
          </div>
        </div>
      </div>

      {/* 기본 정보 / 비밀번호 변경 두 개의 카드 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 기본 정보 수정 폼 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">기본 정보</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* 이름 입력 */}
            <div>
              <label className="block text-gray-700 mb-2">이름</label>
              <div className="relative">
                {/* 아이콘 */}
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                {/* 입력창 */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 이메일 입력 */}
            <div>
              <label className="block text-gray-700 mb-2">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 전화번호 입력 */}
            <div>
              <label className="block text-gray-700 mb-2">전화번호</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 부서 입력 */}
            <div>
              <label className="block text-gray-700 mb-2">부서</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 저장 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              저장하기
            </button>
          </form>
        </div>

        {/* 비밀번호 변경 폼 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">비밀번호 변경</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {/* 현재 비밀번호 */}
            <div>
              <label className="block text-gray-700 mb-2">현재 비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label className="block text-gray-700 mb-2">새 비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>
            </div>

            {/* 새 비밀번호 확인 */}
            <div>
              <label className="block text-gray-700 mb-2">새 비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            {/* 비밀번호 규칙 안내 박스 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다.
              </p>
            </div>

            {/* 비밀번호 변경 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
