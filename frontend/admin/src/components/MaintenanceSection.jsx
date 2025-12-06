import { CCTVFeed } from "./CCTVFeed";

import { Wrench, Clock, AlertCircle, Package, AlertTriangle, Check } from "lucide-react";

import { useState } from "react";

const MAINTENANCE_IMAGE =
  "https://images.unsplash.com/photo-1605822167835-d32696aef686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtYWludGVuYW5jZSUyMHJlcGFpcnxlbnwxfHx8fDE3NjQyODk3MzR8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function MaintenanceSection() {
  // 체크리스트 상태를 저장
  const [checklist, setChecklist] = useState([
    { id: 1, task: "차량 외관 점검", completed: false },
    { id: 2, task: "타이어 공기압 확인", completed: false },
    { id: 3, task: "엔진 오일 레벨 확인", completed: false },
    { id: 4, task: "브레이크 패드 확인", completed: false },
    { id: 5, task: "배터리 전압 측정", completed: false },
    { id: 6, task: "냉각수 레벨 확인", completed: false },
    { id: 7, task: "와이퍼 상태 점검", completed: false },
    { id: 8, task: "등화장치 작동 확인", completed: false },
  ]);

  // 부품 재고 리스트
  const parts = [
    { id: "1", name: "엔진 오일 (5W-30)", category: "오일", stock: 45, minStock: 20, unit: "L" },
    { id: "2", name: "브레이크 오일", category: "오일", stock: 12, minStock: 15, unit: "L" },
    { id: "3", name: "에어 필터", category: "필터", stock: 28, minStock: 10, unit: "개" },
    { id: "4", name: "오일 필터", category: "필터", stock: 35, minStock: 15, unit: "개" },
    { id: "5", name: "브레이크 패드", category: "브레이크", stock: 8, minStock: 12, unit: "세트" },
    { id: "6", name: "브레이크 디스크", category: "브레이크", stock: 15, minStock: 8, unit: "개" },
    {
      id: "7",
      name: "타이어 (205/55R16)",
      category: "타이어",
      stock: 24,
      minStock: 16,
      unit: "개",
    },
    {
      id: "8",
      name: "타이어 (215/60R17)",
      category: "타이어",
      stock: 18,
      minStock: 16,
      unit: "개",
    },
    { id: "9", name: "배터리 (12V 60Ah)", category: "배터리", stock: 5, minStock: 8, unit: "개" },
    { id: "10", name: "냉각수", category: "기타", stock: 30, minStock: 15, unit: "L" },
    { id: "11", name: "와이퍼 블레이드", category: "기타", stock: 22, minStock: 12, unit: "개" },
  ];

  // 체크리스트 항목 토글 함수
  const toggleCheckItem = (id) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const allCompleted = checklist.every((item) => item.completed);

  // 정비 작업 데이터
  const maintenanceJobs = [
    {
      id: "1",
      plateNumber: "12가3456",
      status: "작업중",
      serviceType: "타이어 교체",
      startTime: "14:00",
      estimatedTime: 45,
      technician: "김정비",
      priority: "일반",
    },
    {
      id: "2",
      plateNumber: "78나9012",
      status: "대기중",
      serviceType: "엔진오일 교환",
      startTime: "15:00",
      estimatedTime: 30,
      technician: "이정비",
      priority: "긴급",
    },
    {
      id: "3",
      plateNumber: "34다5678",
      status: "대기중",
      serviceType: "브레이크 점검",
      startTime: "15:30",
      estimatedTime: 60,
      technician: "박정비",
      priority: "일반",
    },
    {
      id: "4",
      plateNumber: "90라1234",
      status: "완료",
      serviceType: "정기 점검",
      startTime: "13:00",
      estimatedTime: 30,
      technician: "김정비",
      priority: "일반",
    },
  ];

  // 통계 계산
  const inProgress = maintenanceJobs.filter((j) => j.status === "작업중").length;
  const waiting = maintenanceJobs.filter((j) => j.status === "대기중").length;
  const urgent = maintenanceJobs.filter((j) => j.priority === "긴급").length;

  return (
    <div className="p-6 space-y-6">
      {/* ---- 통계 카드 ---- */}

      <div className="grid grid-cols-3 gap-6">
        {/* 작업중 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">작업중</p>
              <p className="text-gray-900 mt-2">{inProgress}건</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 대기중 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">대기중</p>
              <p className="text-gray-900 mt-2">{waiting}건</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* 긴급 작업 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">긴급 작업</p>
              <p className="text-gray-900 mt-2">{urgent}건</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ---- CCTV 영역 + 이용 현황 ---- */}
      <div className="grid grid-cols-2 gap-6">
        <CCTVFeed cameraId="CAM-MAINT-001" title="정비존 카메라" imageUrl={MAINTENANCE_IMAGE} />

        {/* 이용 현황 패널 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-gray-900">이용 현황</h3>
          </div>
          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {maintenanceJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900">{job.plateNumber}</p>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      job.status === "작업중"
                        ? "bg-blue-100 text-blue-700"
                        : job.status === "대기중"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{job.serviceType}</p>
                <p className="text-gray-400 text-xs mt-1">담당: {job.technician}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- 체크리스트 + 재고 현황 ---- */}
      <div className="grid grid-cols-3 gap-6">
        {/* 체크리스트 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">정비 체크리스트</h3>
              {allCompleted && <span className="text-green-600 text-sm">정비 완료</span>}
            </div>
          </div>

          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheckItem(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  item.completed ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                    item.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 text-white" />}
                </div>
                <span
                  className={`${item.completed ? "text-green-700 line-through" : "text-gray-900"}`}
                >
                  {item.task}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 재고 현황 */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">부품 재고 현황</h3>
              <span className="text-gray-500 text-sm">
                {parts.filter((p) => p.stock < p.minStock).length}개 항목 재고 부족
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">부품명</th>
                  <th className="px-4 py-3 text-left text-gray-700">카테고리</th>
                  <th className="px-4 py-3 text-center text-gray-700">현재 재고</th>
                  <th className="px-4 py-3 text-center text-gray-700">최소 재고</th>
                  <th className="px-4 py-3 text-center text-gray-700">상태</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {parts.map((part) => {
                  const isLowStock = part.stock < part.minStock;
                  const stockPercentage = (part.stock / part.minStock) * 100;

                  return (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-gray-900">{part.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          {part.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={isLowStock ? "text-red-600" : "text-gray-900"}>
                          {part.stock} {part.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {part.minStock} {part.unit}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {isLowStock ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 text-sm">재고부족</span>
                            </>
                          ) : stockPercentage < 150 ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                              <span className="text-yellow-600 text-sm">주의</span>
                            </>
                          ) : (
                            <>
                              <Package className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 text-sm">정상</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
