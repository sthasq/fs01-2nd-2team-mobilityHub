import { useState } from "react";
import axios from "axios";
import "../style/LicenseModal.css";

const API_BASE = "http://localhost:9000";

export default function LicenseModal({ data, onClose, onSuccess }) {
  const [plate, setPlate] = useState(data?.carNumber || "");

  const submit = async () => {
    try {
      await axios.put(`${API_BASE}/entrance/plate`, {
        workId: data.workId,
        carNumber: plate,
      });
      onSuccess();
      onClose();
    } catch (e) {
      alert("번호판 수정 실패");
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
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button className="btn-save" onClick={submit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
