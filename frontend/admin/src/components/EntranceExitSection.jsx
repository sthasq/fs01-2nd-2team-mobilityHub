import { CCTVFeed } from "./CCTVFeed.jsx";

import { Car, Clock, Eye } from "lucide-react";

import { useState } from "react";

import { LicensePlateModal } from "./LicensePlateModal.jsx";

// 샘플 이미지 URL
const CCTV_IMAGE =
  "https://images.unsplash.com/photo-1653750366046-289780bd8125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwc2VjdXJpdHklMjBjYW1lcmF8ZW58MXx8fHwxNzY0Mjg5NzM0fDA&ixlib=rb-4.1.0&q=80&w=1080";

const PLATE_IMAGE =
  "https://images.unsplash.com/photo-1736022055377-8bbbdf2e5b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWNlbnNlJTIwcGxhdGUlMjBjYXJ8ZW58MXx8fHwxNzY0Mjg5NzMzfDA&ixlib=rb-4.1.0&q=80&w=1080";

export default function EntranceExitSection() {
  // 선택된 차량 정보 상태
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // 차량 입출차 기록 상태
  const [vehicleRecords, setVehicleRecords] = useState([
    {
      id: "1",
      plateNumber: "12가3456",
      plateImage: PLATE_IMAGE,
      type: "입차",
      time: "2025-11-28 14:23",
      status: "success",
    },
    {
      id: "2",
      plateNumber: "78나9012",
      plateImage: PLATE_IMAGE,
      type: "출차",
      time: "2025-11-28 14:20",
      status: "success",
    },
    {
      id: "3",
      plateNumber: "34다5?78",
      plateImage: PLATE_IMAGE,
      type: "입차",
      time: "2025-11-28 14:15",
      status: "pending",
    },
    {
      id: "4",
      plateNumber: "90라1234",
      plateImage: PLATE_IMAGE,
      type: "출차",
      time: "2025-11-28 14:10",
      status: "success",
    },
    {
      id: "5",
      plateNumber: "56마??90",
      plateImage: PLATE_IMAGE,
      type: "출차",
      time: "2025-11-28 13:55",
      status: "pending",
    },
    {
      id: "6",
      plateNumber: "23바7890",
      plateImage: PLATE_IMAGE,
      type: "입차",
      time: "2025-11-28 13:45",
      status: "success",
    },
  ]);

  // 번호판 수정 저장 함수
  const handleSavePlateNumber = (id, newPlateNumber) => {
    setVehicleRecords(
      vehicleRecords.map((record) =>
        record.id === id ? { ...record, plateNumber: newPlateNumber, status: "success" } : record
      )
    );
  };

  // 입차/출차 기록 필터링
  const entryRecords = vehicleRecords.filter((r) => r.type === "입차");
  const exitRecords = vehicleRecords.filter((r) => r.type === "출차");

  // 통계 수치 계산
  const todayInCount = entryRecords.length;
  const todayOutCount = exitRecords.length;
  const currentOccupancy = todayInCount - todayOutCount;

  return (
    <div className="p-6 space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 금일 입차 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">금일 입차</p>
              <p className="mt-2 text-gray-900">{todayInCount}대</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 금일 출차 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">금일 출차</p>
              <p className="mt-2 text-gray-900">{todayOutCount}대</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 현재 주차 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">현재 주차</p>
              <p className="mt-2 text-gray-900">{currentOccupancy}대</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* CCTV 피드 + 입출차 기록 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 입구 카메라 + 입차 기록 */}
        <div className="space-y-6">
          <CCTVFeed cameraId="CAM-ENT-001" title="입구 카메라" imageUrl={CCTV_IMAGE} />

          {/* 입차 기록 테이블 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-gray-900">입차 차량 기록</h3>
            </div>
            <VehicleTable records={entryRecords} setSelectedVehicle={setSelectedVehicle} />
          </div>
        </div>

        {/* 출구 카메라 + 출차 기록 */}
        <div className="space-y-6">
          <CCTVFeed cameraId="CAM-EXIT-001" title="출구 카메라" imageUrl={CCTV_IMAGE} />

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-gray-900">출차 차량 기록</h3>
            </div>
            <VehicleTable records={exitRecords} setSelectedVehicle={setSelectedVehicle} />
          </div>
        </div>
      </div>

      {/* 번호판 모달 */}
      {selectedVehicle && (
        <LicensePlateModal
          isOpen={true}
          onClose={() => setSelectedVehicle(null)}
          vehicleData={selectedVehicle}
          onSave={handleSavePlateNumber}
        />
      )}
    </div>
  );
}

// 차량 테이블만 따로 분리한 컴포넌트
function VehicleTable({ records, setSelectedVehicle }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-gray-700 text-left">차량번호</th>
            <th className="px-4 py-3 text-gray-700 text-left">시간</th>
            <th className="px-4 py-3 text-gray-700 text-left">상태</th>
            <th className="px-4 py-3 text-gray-700 text-left">작업</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              {/* 차량 번호 */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{record.plateNumber}</span>

                  {/* 번호판 오류(검증 실패) */}
                  {record.status === "pending" && (
                    <span className="text-yellow-600 text-xs">⚠️</span>
                  )}
                </div>
              </td>

              {/* 시간 */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Clock className="w-3 h-3" />
                  {/* "YYYY-MM-DD HH:mm" 에서 시간만 추출 */}
                  <span>{record.time.split(" ")[1]}</span>
                </div>
              </td>

              {/* 상태 */}
              <td className="px-4 py-3">
                {record.status === "success" ? (
                  <span className="text-green-600 text-sm">✓ 완료</span>
                ) : (
                  <span className="text-yellow-600 text-sm">대기</span>
                )}
              </td>

              {/* 보기 버튼 */}
              <td className="px-4 py-3">
                <button
                  onClick={() => setSelectedVehicle(record)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-3 h-3" />
                  보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
