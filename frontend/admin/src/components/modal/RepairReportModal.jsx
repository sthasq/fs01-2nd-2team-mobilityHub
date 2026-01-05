import { useEffect, useMemo, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import "../style/RepairReportModal.css";
import { sendComplete, writeReport } from "../../api/repairAPI";

export default function RepairReportModal({ onClose, data, refreshStockList }) {
  const [usedParts, setUsedParts] = useState([]);
  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 지연 함수
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    repairTitle: "",
    repairDetail: "",
    repairAmount: 0,
  });

  // 보고서 데이터 메모이제이션
  const reportData = useMemo(() => {
    if (!data) return null;
    return Array.isArray(data) ? data ?? null : data;
  }, [data]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 작업 완료 신호 전송 핸들러
  const handleSubmit = async (reportData) => {
    console.log(reportData);

    try {
      const completeResponse = await sendComplete(reportData);

      if (completeResponse.status === 200) {
        console.log("작업 완료 신호 전송 성공");
      }
    } catch (error) {
      console.error("전송 실패:", error);
      alert("완료 신호 전송 실패");
    }
  };

  // 보고서 작성 핸들러
  const handleCreate = async (e) => {
    e.preventDefault();

    const isEmptyField = Object.values(formData).some((value) => value === "" || value == null);

    if (isEmptyField) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const requestBody = {
      userCarId: reportData.userCarId,
      carNumber: reportData.car_number,
      repairTitle: formData.repairTitle,
      repairDetail: formData.repairDetail,
      repairAmount: Number(calculateTotal()),
    };

    const workInfoId = reportData.id;

    // 보고서 작성 API 호출
    try {
      setLoading(true);

      const response = await writeReport(requestBody);

      if (response.status === 200) {
        await delay(1000);

        await handleSubmit(workInfoId);
        await refreshStockList();
        onClose();
        alert("보고서 작성이 완료되었습니다.");
        window.location.reload();
      }

      return response;
    } catch (error) {
      console.error("보고서 작성 실패: ", error);
      alert("보고서 작성 실패");
    } finally {
      setLoading(false);
    }
  };

  // 총 금액 계산(기본 60000 + 추가 금액)
  const calculateTotal = () => {
    let total = 60000 + Number(formData.repairAmount);
    usedParts.forEach((up) => {
      total += up.part.price * up.quantity;
    });
    return total;
  };

  // 오늘 날짜 포맷팅
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="modal-overlay">
      {reportData && (
        <div className="modal-content">
          {/* 헤더 */}
          <div className="modal-header">
            <div>
              <h2>정비 완료 보고서</h2>
            </div>
            <p>차량번호: {reportData.car_number}</p>
            <button className="modal-close-btn" onClick={onClose}>
              <X className="icon" />
            </button>
          </div>

          {/* 바디 */}
          <div className="modal-body">
            {/* 추가 요청사항 */}
            <div className="section">
              <h3>추가 요청사항</h3>
              <div className="section-content">
                <div className="item-box">
                  {reportData.additionalRequest ? reportData.additionalRequest : "없음"}
                </div>
              </div>
            </div>

            {/* 수리 내용 */}
            <div className="section">
              <h3>수리 내용</h3>
              <textarea
                name="repairTitle"
                value={formData.repairTitle}
                onChange={handleChange}
                placeholder="수리한 내용을 입력하세요..."
              />
            </div>

            {/* 상세 내용 */}
            <div className="section">
              <h3>상세 내용</h3>
              <textarea
                name="repairDetail"
                value={formData.repairDetail}
                onChange={handleChange}
                placeholder="상세 내용..."
              />
            </div>
            <div className="section">
              <h3>정비 금액</h3>
              <div>
                <span>기본금액 : 60000</span>

                <div>
                  <span>추가금액 : </span>
                  <input
                    type="number"
                    name="repairAmount"
                    value={formData.repairAmount}
                    placeholder="추가금액을 입력하세요."
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="modal-footer">
            <span>정비한 날짜: {today}</span>
            <span>총 금액: {calculateTotal()}원</span>
            <div className="flex-row gap">
              <button className="btn-cancel" onClick={onClose}>
                취소
              </button>
              <button className="btn-submit" onClick={handleCreate}>
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
