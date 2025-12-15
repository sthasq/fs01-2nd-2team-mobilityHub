import { useEffect, useState } from "react";
import axios from "axios";
import LicenseModal from "./LicenseModal";
import "../style/EntranceExitSection.css";

const API_BASE = "http://localhost:9000";
const PAGE_SIZE = 6;

export default function EntranceExitSection() {
  const [latest, setLatest] = useState(null);
  const [todayEntry, setTodayEntry] = useState([]);
  const [todayExit, setTodayExit] = useState([]);

  const [entryPage, setEntryPage] = useState(1);
  const [exitPage, setExitPage] = useState(1);

  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [latestRes, entryRes, exitRes] = await Promise.all([
      axios.get(`${API_BASE}/entrance/latest`),
      axios.get(`${API_BASE}/entrance/today/entry`),
      axios.get(`${API_BASE}/entrance/today/exit`),
    ]);

    setLatest(latestRes.data);
    setTodayEntry(entryRes.data);
    setTodayExit(exitRes.data);
  };

  const paginate = (list, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  };

  const approve = async (workId) => {
    await axios.post(`${API_BASE}/entrance/${workId}/approve`);
    loadAll();
  };

  return (
    <div className="entrance-page">
      {/* ===== 상단 CCTV + 최근 인식 ===== */}
      <div className="top-grid">
        <div className="card cctv-box">
          <div className="cctv-placeholder">📷 CCTV 스트림 대기중</div>
        </div>

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
                  {latest.carNumber || latest.ocrNumber || "미확인"}
                </span>
              </p>
              <p>카메라 : {latest.cameraId}</p>
              <p>{new Date(latest.time).toLocaleString()}</p>

              {!latest.match && latest.workId && (
                <button className="btn-approve" onClick={() => approve(latest.workId)}>
                  입차 승인
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===== 입차 / 출차 기록 ===== */}
      <div className="record-grid">
        {/* 입차 */}
        <RecordTable
          title="입차 차량 기록"
          data={paginate(todayEntry, entryPage)}
          page={entryPage}
          total={todayEntry.length}
          onPageChange={setEntryPage}
          onClickPlate={setModalData}
          type="entry"
        />

        {/* 출차 */}
        <RecordTable
          title="출차 차량 기록"
          data={paginate(todayExit, exitPage)}
          page={exitPage}
          total={todayExit.length}
          onPageChange={setExitPage}
          type="exit"
        />
      </div>

      {modalData && (
        <LicenseModal data={modalData} onClose={() => setModalData(null)} onSuccess={loadAll} />
      )}
    </div>
  );
}

/* ================= 하위 컴포넌트 ================= */

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
              <tr key={v.id}>
                <td
                  className={v.carNumber ? "plate-ok" : "plate-error"}
                  onClick={() => onClickPlate && onClickPlate(v)}
                >
                  {v.carNumber || "미확인"}
                </td>
                <td>{new Date(type === "entry" ? v.entryTime : v.exitTime).toLocaleString()}</td>
                <td>{type === "exit" ? "출차 완료" : v.carNumber ? "정상" : "확인 필요"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
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
