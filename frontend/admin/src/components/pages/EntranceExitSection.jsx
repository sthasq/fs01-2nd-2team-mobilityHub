import { useEffect, useState } from "react";
import "../style/EntranceExitSection.css";

import useMqtt from "../hook/useMqtt";
import {
  getTodayEntry,
  getTodayExit,
  getCurrentEntranceCar,
  approveEntrance,
} from "../../api/EntranceAPI";

const MQTT_BROKER = "ws://192.168.137.1:9001";

export default function EntranceExitSection() {
  const { connectStatus, imageSrc, capturedImage, publish } = useMqtt(MQTT_BROKER);

  const [currentCar, setCurrentCar] = useState(null);
  const [entryList, setEntryList] = useState([]);
  const [exitList, setExitList] = useState([]);

  /* =========================
     초기 로딩
  ========================= */
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [entry, exit] = await Promise.all([getTodayEntry(), getTodayExit()]);

    setEntryList(entry);
    setExitList(exit);

    try {
      const current = await getCurrentEntranceCar(1);
      setCurrentCar(current);
    } catch {
      setCurrentCar(null);
    }
  };

  /* =========================
     CCTV 스트리밍 제어
  ========================= */
  useEffect(() => {
    if (connectStatus === "connected") {
      publish("parking/web/entrance/cam", "start");
    }
    return () => {
      publish("parking/web/entrance/cam", "stop");
    };
  }, [connectStatus]);

  /* =========================
     입차 승인 (UX 개선 적용)
  ========================= */
  const handleApprove = async () => {
    if (!currentCar) return;

    //  UX 즉시 반영
    setCurrentCar(null);

    //  게이트 열기
    publish("parking/web/entrance/approve", "open");

    try {
      await approveEntrance(currentCar.carNumber);

      const [entry, exit] = await Promise.all([getTodayEntry(), getTodayExit()]);

      setEntryList(entry);
      setExitList(exit);
    } catch {
      alert("입차 승인 실패");
    }
  };

  return (
    <div className="entrance-exit-section">
      <h2>구역 관리 : 입출구</h2>
      <p className="sub-title">실시간 모니터링 및 관리</p>

      {/* ===== 상단 ===== */}
      <div className="top-grid">
        {/* CCTV */}
        <div className="card cctv-card">
          {imageSrc ? (
            <img src={imageSrc} alt="CCTV" />
          ) : (
            <div className="cctv-placeholder">📹 CCTV 대기중</div>
          )}
        </div>

        {/* 현재 입구 차량 */}
        <div className="card current-car-card">
          <h3>현재 입구 차량</h3>

          {currentCar ? (
            <>
              <p>
                <strong>차량 번호:</strong> {currentCar.carNumber ?? "-"}
              </p>

              <p>
                <strong>요청 시간:</strong>{" "}
                {currentCar.requestTime
                  ? new Date(currentCar.requestTime).toLocaleString()
                  : "대기중"}
              </p>

              {capturedImage ? (
                <img src={capturedImage} className="preview-image" />
              ) : (
                <p className="placeholder">📷 캡처 대기중</p>
              )}

              <button className="approve-btn" onClick={handleApprove}>
                입차 승인
              </button>
            </>
          ) : (
            <p className="placeholder">현재 입구 대기 차량 없음</p>
          )}
        </div>
      </div>

      {/* ===== 하단 ===== */}
      <div className="bottom-grid">
        {/* 입차 기록 */}
        <div className="card">
          <h3>입차 차량 기록</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {entryList.length === 0 ? (
                <tr>
                  <td colSpan="3">입차 기록 없음</td>
                </tr>
              ) : (
                entryList.map((row) => (
                  <tr key={row.carNumber}>
                    <td>{row.carNumber}</td>
                    <td>{row.entryTime ? new Date(row.entryTime).toLocaleString() : "-"}</td>
                    <td className="status entry">입차</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 출차 기록 */}
        <div className="card">
          <h3>출차 차량 기록</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {exitList.length === 0 ? (
                <tr>
                  <td colSpan="3">출차 기록 없음</td>
                </tr>
              ) : (
                exitList.map((row) => (
                  <tr key={row.carNumber}>
                    <td>{row.carNumber}</td>
                    <td>{row.exitTime ? new Date(row.exitTime).toLocaleString() : "-"}</td>
                    <td className="status exit">출차</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
