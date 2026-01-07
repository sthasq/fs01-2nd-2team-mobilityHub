import React, { useEffect, useState } from "react";
import { Car, CheckCircle, XCircle } from "lucide-react";

import "../style/ParkingSection.css"; // CSS 분리
import "../../App.css";
import useMqtt from "../hook/useMqtt";
import { getParkingList } from "../../api/parkingAPI";

export default function ParkingSection() {
  const [parkingList, setparkingList] = useState([]);
  const { connectStatus, imageSrc, publish } = useMqtt();

  useEffect(() => {
    if (connectStatus === "connected") {
      publish("parking/web/parking/cam/control", "start");
    }

    getParkingList()
      .then((res) => {
        setparkingList(res);
      })
      .catch((err) => console.error("조회실패: ", err));

    return () => {
      publish("/parking/web/parking/cam/control", "stop");
    };
  }, [connectStatus, publish]);

  // 주차 판단 로직
  // P로 시작하는 주차 구역만
  const parkingOnly = parkingList.filter((p) => p.sectorId && p.sectorId.startsWith("P"));

  // 사용 중 판단
  const parkingSpots = parkingOnly.map((p) => {
    const isOccupied = p.carNumber !== null && p.entryTime !== null && p.exitTime === null;

    return {
      id: p.sectorId,
      soptNumber: p.sectorId,
      status: isOccupied ? "사용중" : "사용가능",
      plateNumber: p.carNumber,
      parkedSince: p.entryTime,
    };
  });

  // 주차 구역 기준 통계 계산
  const totalCount = parkingSpots.length;
  const usedCount = parkingSpots.filter((p) => p.status === "사용중").length;

  const availableCount = totalCount - usedCount;
  const occupancyRate = totalCount === 0 ? 0 : Math.round((usedCount / totalCount) * 100);

  return (
    <div className="page">
      {/* 통계 카드 */}
      <div className="status-card">
        {/* <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">전체 주차면</p>
              <p className="count">{sectors.length}</p>
            </div>
            <div className="stat-icon bg-gray">
              <Car />
            </div>
          </div>
        </div> */}

        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">사용중</p>
              <p className="stat-value text-red">{usedCount} 대</p>
            </div>
            <div className="stat-icon bg-red">
              <XCircle />
            </div>
          </div>
        </div>

        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">사용가능</p>
              <p className="stat-value text-green">{availableCount} 면</p>
            </div>
            <div className="stat-icon bg-green">
              <CheckCircle />
            </div>
          </div>
        </div>

        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">점유율</p>
              <p className="stat-value text-blue">{occupancyRate} %</p>
            </div>
            <div className="stat-icon bg-blue">
              <Car />
            </div>
          </div>
        </div>
      </div>

      {/* CCTV + 주차 공간 */}
      <div className="main-grid">
        {/* CCTV 화면 */}
        <div className="cctv-container">
          {imageSrc ? (
            <img src={imageSrc} alt="camera" />
          ) : (
            <div className="cctv-placeholder">No Camera</div>
          )}
        </div>

        {/* 주차 공간 리스트 */}
        <div className="p-4 space-y-3">
          {parkingSpots.map((spot) => (
            <div
              key={spot.id}
              className={`p-4 rounded-lg border-2 ${
                spot.status === "사용가능"
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Car
                    className={`w-5 h-5 ${
                      spot.status === "사용가능" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={`${spot.status === "사용가능" ? "text-green-900" : "text-red-900"}`}
                  >
                    {spot.spotNumber}번 주차면
                  </span>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    spot.status === "사용가능"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {spot.status}
                </span>
              </div>

              {spot.status === "사용중" && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">차량번호</span>
                    <span className="text-red-900">{spot.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">주차 시작</span>
                    <span className="text-red-900">{spot.parkedSince}</span>
                  </div>
                </div>
              )}

              {spot.status === "사용가능" && (
                <p className="text-center text-green-700 text-sm">주차 가능</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
