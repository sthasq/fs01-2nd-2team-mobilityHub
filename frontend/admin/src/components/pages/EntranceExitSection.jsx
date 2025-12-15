import { useEffect, useState } from "react";
import axios from "axios";
import LicenseModal from "./LicenseModal";
import "../style/EntranceExitSection.css";

// 🔥 MQTT hook
import useMqtt from "../hook/useMqtt";

const API_BASE = "http://localhost:9000";
const PAGE_SIZE = 6;

// ✅ MQTT Broker
const BROKER_URL = "ws://192.168.0.201:9001";

// ✅ 라즈베리파이와 동일한 토픽
const ENTRANCE_CAM_TOPIC = "parking/web/entrance/cam";

export default function EntranceExitSection() {
  /* =========================
      STATE
  ========================= */
  const [latest, setLatest] = useState(null);
  const [todayEntry, setTodayEntry] = useState([]);
  const [todayExit, setTodayExit] = useState([]);

  const [entryPage, setEntryPage] = useState(1);
  const [exitPage, setExitPage] = useState(1);

  const [modalData, setModalData] = useState(null);

  // 🔥 MQTT
  const { connectStatus, imageSrc, publish } = useMqtt(BROKER_URL);

  /* =========================
      날짜 표시
  ========================= */
  const todayLabel = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  /* =========================
      초기 로딩
  ========================= */
  useEffect(() => {
    loadAll();
  }, []);

  /* =========================
      📡 카메라 START / STOP
      (라즈베리파이 코드 기준)
  ========================= */
  useEffect(() => {
    if (connectStatus === "connected") {
      console.log("📡 Entrance Camera START");
      publish(ENTRANCE_CAM_TOPIC, "start");
    }

    return () => {
      console.log("🛑 Entrance Camera STOP");
      publish(ENTRANCE_CAM_TOPIC, "stop");
    };
  }, [connectStatus]);

  /* =========================
      📡 API 로딩
  ========================= */
  const loadAll = async () => {
    try {
      const [latestRes, entryRes, exitRes] = await Promise.all([
        axios.get(`${API_BASE}/entrance/latest`),
        axios.get(`${API_BASE}/entrance/today/entry`),
        axios.get(`${API_BASE}/entrance/today/exit`),
      ]);

      setLatest(latestRes.data || null);
      setTodayEntry(entryRes.data || []);
      setTodayExit(exitRes.data || []);
    } catch (e) {
      console.error("입출차 데이터 로딩 실패", e);
    }
  };

  /* =========================
      페이지네이션
  ========================= */
  const paginate = (list, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  };

  /* =========================
      입차 승인
  ========================= */
  const approve = async (workId) => {
    if (!workId) return;

    try {
      await axios.post(`${API_BASE}/entrance/${workId}/approve`);
      await loadAll();
    } catch (e) {
      console.error("입차 승인 실패", e);
      alert("입차 승인 중 오류 발생");
    }
  };

  /* =========================
      RENDER
  ========================= */
  return (
    <div className="entrance-page">
      {/* ================= 상단 ================= */}
      <div className="top-grid">
        {/* 🔥 CCTV 영역 */}
        <div className="card cctv-box">
          {imageSrc ? (
            <img src={imageSrc} alt="entrance cam" className="cctv-view" />
          ) : (
            <div className="cctv-placeholder">📷 CCTV 스트림 대기중 ({connectStatus})</div>
          )}
        </div>

        {/* ================= 최근 인식 ================= */}
        <div className="card recent-card">
          <h3>최근 인식 번호판</h3>

          {!latest ? (
            <p className="empty-text">대기중</p>
          ) : (
            <>
              <p>
                번호판 :{" "}
                <span
                  className={latest.match ? "plate-ok" : "plate-error"}
                  onClick={() => setModalData(latest)}
                >
                  {latest.carNumber || latest.correctedOcrNumber || latest.ocrNumber || "미확인"}
                </span>
              </p>

              <p>카메라 : {latest.cameraId || "-"}</p>

              <p className="recent-time">
                최근 인식 시각 : {latest.time ? new Date(latest.time).toLocaleString() : "-"}
              </p>

              {!latest.match && latest.workId && (
                <button className="btn-approve" onClick={() => approve(latest.workId)}>
                  입차 승인
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= 금일 통계 ================= */}
      <div className="summary-box">
        <p className="summary-date">기준일 : {todayLabel}</p>
        <p className="summary-count">
          🚗 금일 입차 : <strong>{todayEntry.length}</strong>대
        </p>
        <p className="summary-count">
          🚙 금일 출차 : <strong>{todayExit.length}</strong>대
        </p>
      </div>

      {/* ================= 입차 / 출차 기록 ================= */}
      <div className="record-grid">
        <RecordTable
          title="입차 차량 기록"
          data={paginate(todayEntry, entryPage)}
          page={entryPage}
          total={todayEntry.length}
          onPageChange={setEntryPage}
          onClickPlate={setModalData}
          type="entry"
        />

        <RecordTable
          title="출차 차량 기록"
          data={paginate(todayExit, exitPage)}
          page={exitPage}
          total={todayExit.length}
          onPageChange={setExitPage}
          type="exit"
        />
      </div>

      {/* ================= OCR 수정 모달 ================= */}
      {modalData && (
        <LicenseModal data={modalData} onClose={() => setModalData(null)} onSuccess={loadAll} />
      )}
    </div>
  );
}

/* =========================
    테이블 컴포넌트
========================= */
function RecordTable({ title, data, page, total, onPageChange, onClickPlate, type }) {
  const totalPage = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="card record-card">
      <h3>{title}</h3>

      <table>
        <thead>
          <tr>
            <th>번호판</th>
            <th>시간</th>
            <th>상태</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="empty-row">
                기록 없음
              </td>
            </tr>
          ) : (
            data.map((v) => (
              <tr key={v.id ?? `${type}-${v.imageId}`}>
                <td
                  className={v.carNumber ? "plate-ok" : "plate-error"}
                  onClick={() => onClickPlate && onClickPlate(v)}
                >
                  {v.carNumber || v.correctedOcrNumber || v.ocrNumber || "미확인"}
                </td>

                <td>{new Date(type === "entry" ? v.entryTime : v.exitTime).toLocaleString()}</td>

                <td>{type === "exit" ? "출차 완료" : v.carNumber ? "정상" : "확인 필요"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPage > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            ◀
          </button>
          <span>
            {page} / {totalPage}
          </span>
          <button disabled={page === totalPage} onClick={() => onPageChange(page + 1)}>
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
