import { useState, useEffect } from "react";
import { User, Mail, Phone, Shield } from "lucide-react";
import "../style/AdminSection.css";
import axios from "axios";

export default function AdminSection() {
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드에서 관리자 목록 조회
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:9000/admin/list");
        
        // DB 데이터를 화면에 맞게 변환
        const admins = response.data.map((admin) => ({
          id: admin.adminId,
          adminId: admin.adminId,
          name: admin.adminName,
          area: getAreaFromAdminId(admin.adminId),
          phone: "010-0000-0000",
          email: `${admin.adminId}@smartpark.com`,
          isCurrentUser: admin.adminId === "Padmin"
        }));
        
        setAllAdmins(admins);
        setLoading(false);
      } catch (err) {
        console.error("관리자 목록 조회 실패:", err);
        setError("데이터를 불러올 수 없습니다.");
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // 관리자 ID로 구역 판단
  const getAreaFromAdminId = (adminId) => {
    switch (adminId) {
      case "Padmin":
        return "주차장";
      case "Radmin":
        return "정비소";
      case "Tadmin":
        return "전체";
      case "Wadmin":
        return "세차장";
      default:
        return "기타";
    }
  };

  const getAreaClass = (area) => {
    switch (area) {
      case "전체":
        return "tag purple";
      case "입출구":
        return "tag blue";
      case "세차장":
        return "tag green";
      case "정비소":
        return "tag orange";
      case "주차장":
        return "tag indigo";
      case "통계 분석":
        return "tag pink";
      default:
        return "tag gray";
    }
  };

  if (loading) return <div className="admin-wrapper"><div className="admin-box"><p>로딩 중...</p></div></div>;
  if (error) return <div className="admin-wrapper"><div className="admin-box"><p>{error}</p></div></div>;

  return (
    <div className="admin-wrapper">
      <div className="admin-box">
        <div className="admin-header">
          <h3>전체 관리자 목록</h3>
          <p>총 {allAdmins.length}명의 관리자</p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>관리자 ID</th>
                <th>이름</th>
                <th>관리 구역</th>
                <th>연락처</th>
                <th>이메일</th>
              </tr>
            </thead>

            <tbody>
              {allAdmins.map((admin) => (
                <tr key={admin.id} className={admin.isCurrentUser ? "highlight-row" : ""}>
                  <td>
                    <div className="id-cell">
                      {admin.isCurrentUser && <Shield className="icon-shield" />}
                      {admin.adminId}
                    </div>
                  </td>

                  <td>
                    <div className="name-cell">
                      <div className={`avatar ${admin.isCurrentUser ? "main" : ""}`}>
                        <User className="avatar-icon" />
                      </div>
                      {admin.name}
                    </div>
                  </td>

                  <td>
                    <span className={getAreaClass(admin.area)}>{admin.area}</span>
                  </td>

                  <td>
                    <div className="info-cell">
                      <Phone className="info-icon" />
                      {admin.phone}
                    </div>
                  </td>

                  <td>
                    <div className="info-cell">
                      <Mail className="info-icon" />
                      {admin.email}
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