import { useState } from "react";
import { updateOcrNumber } from "../../api/EntranceAPI";
import "../style/LicenseModal.css";

export default function LicenseModal({ data, onClose, onSuccess }) {
  const [plate, setPlate] = useState(data.correctedOcrNumber || data.ocrNumber || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!data.imageId) {
      alert("이미지 정보가 없습니다.");
      return;
    }

    try {
      setLoading(true);

      // ✅ OCR 수정
      await updateOcrNumber(data.imageId, plate);

      // ✅ 최신 데이터 강제 재조회
      await onSuccess(true);

      onClose();
    } catch (e) {
      console.error("OCR 수정 실패", e);
      alert("번호판 수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>번호판 수정</h2>

        <input
          className="modal-input"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="차량 번호 입력"
        />

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            취소
          </button>
          <button className="btn-save" onClick={submit} disabled={loading}>
            {loading ? "저장중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
