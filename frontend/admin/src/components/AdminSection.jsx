// 관리자 정보를 표시하기 위해 필요한 아이콘들을 불러옵니다.
import { User, Mail, Phone, Shield } from "lucide-react";

// 이 컴포넌트는 전체 관리자 목록을 표 형태로 보여줍니다.
// TypeScript의 interface는 제거하여 JSX 환경에 맞게 구성했습니다.
export default function AdminSection() {
  // 현재 로그인한 관리자의 정보를 저장한 객체입니다.
  const currentAdmin = {
    id: "1",
    adminId: "admin001",
    name: "관리자",
    area: "전체",
    phone: "010-1234-5678",
    email: "admin@smartpark.com",
    isCurrentUser: true,
  };

  // 모든 관리자들의 정보를 배열 형태로 저장합니다.
  const allAdmins = [
    {
      id: "1",
      adminId: "admin001",
      name: "관리자",
      area: "전체",
      phone: "010-1234-5678",
      email: "admin@smartpark.com",
      isCurrentUser: true,
    },
    {
      id: "2",
      adminId: "admin002",
      name: "김입구",
      area: "입출구",
      phone: "010-2345-6789",
      email: "entrance@smartpark.com",
    },
    {
      id: "3",
      adminId: "admin003",
      name: "이세차",
      area: "세차장",
      phone: "010-3456-7890",
      email: "carwash@smartpark.com",
    },
    {
      id: "4",
      adminId: "admin004",
      name: "박정비",
      area: "정비존",
      phone: "010-4567-8901",
      email: "maintenance@smartpark.com",
    },
    {
      id: "5",
      adminId: "admin005",
      name: "최주차",
      area: "주차장",
      phone: "010-5678-9012",
      email: "parking@smartpark.com",
    },
    {
      id: "6",
      adminId: "admin006",
      name: "정통계",
      area: "통계 분석",
      phone: "010-6789-0123",
      email: "stats@smartpark.com",
    },
  ];

  // 관리 구역에 따라 태그 색상을 다르게 지정하는 함수입니다.
  const getAreaColor = (area) => {
    switch (area) {
      case "전체":
        return "bg-purple-100 text-purple-700";
      case "입출구":
        return "bg-blue-100 text-blue-700";
      case "세차장":
        return "bg-green-100 text-green-700";
      case "정비존":
        return "bg-orange-100 text-orange-700";
      case "주차장":
        return "bg-indigo-100 text-indigo-700";
      case "통계 분석":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 전체 관리자 목록을 감싸는 박스입니다. */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">전체 관리자 목록</h3>
          <p className="text-gray-500 text-sm mt-1">총 {allAdmins.length}명의 관리자</p>
        </div>

        {/* 표 형태로 관리자 정보를 표시합니다. */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">관리자 ID</th>
                <th className="px-6 py-3 text-left text-gray-700">이름</th>
                <th className="px-6 py-3 text-left text-gray-700">관리 구역</th>
                <th className="px-6 py-3 text-left text-gray-700">연락처</th>
                <th className="px-6 py-3 text-left text-gray-700">이메일</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className={`${
                    admin.isCurrentUser ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  {/* 관리자 ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {admin.isCurrentUser && <Shield className="w-4 h-4 text-blue-600" />}
                      <span className={admin.isCurrentUser ? "text-blue-900" : "text-gray-900"}>
                        {admin.adminId}
                      </span>
                    </div>
                  </td>

                  {/* 이름 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          admin.isCurrentUser ? "bg-blue-500" : "bg-gray-400"
                        }`}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className={admin.isCurrentUser ? "text-blue-900" : "text-gray-900"}>
                        {admin.name}
                      </span>
                    </div>
                  </td>

                  {/* 관리 구역 */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm ${getAreaColor(
                        admin.area
                      )}`}
                    >
                      {admin.area}
                    </span>
                  </td>

                  {/* 연락처 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{admin.phone}</span>
                    </div>
                  </td>

                  {/* 이메일 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{admin.email}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
