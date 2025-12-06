import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ChevronLeft } from "lucide-react";

export default function ServiceProgress({ userId, selectedVehicle, onBack }) {
  // 선택된 서비스 관리
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [services, setServices] = useState([]);

  // 진행 여부
  const [isServiceStarted, setIsServiceStarted] = useState(false);

  // 다이얼로그 ON/OFF
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // 진행 중인 서비스 index
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // 서비스 종류 정의 (JSX 환경에서는 Record 삭제)
  const SERVICE_NAMES = {
    maintenance: "정비",
    carwash: "세차",
    parking: "주차",
  };

  const SERVICE_ORDER = ["maintenance", "carwash", "parking"];

  // 타이머로 서비스 단계 자동 진행
  useEffect(() => {
    if (isServiceStarted && services.length > 0) {
      const interval = setInterval(() => {
        processServices();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isServiceStarted, services, currentServiceIndex]);

  // 서비스 진행 로직
  const processServices = () => {
    setServices((prev) => {
      const updated = [...prev];

      for (let i = 0; i < updated.length; i++) {
        if (updated[i].status === "inProgress") {
          updated[i].status = "completed";

          // 다음 서비스 시작
          for (let j = i + 1; j < updated.length; j++) {
            if (updated[j].status === "waiting") {
              updated[j].status = "inProgress";
              break;
            }
          }
          break;
        }
      }
      return updated;
    });
  };

  // 버튼 선택/해제
  const toggleService = (type) => {
    if (isServiceStarted) return;

    const newSet = new Set(selectedServices);
    if (newSet.has(type)) newSet.delete(type);
    else newSet.add(type);

    setSelectedServices(newSet);
  };

  // 서비스 시작 전 확인
  const handleSubmit = () => {
    if (selectedServices.size === 0) {
      alert("서비스를 선택해주세요.");
      return;
    }
    setShowConfirmDialog(true);
  };

  // 서비스 시작 확정
  const handleConfirm = () => {
    const ordered = SERVICE_ORDER.filter((type) => selectedServices.has(type)).map(
      (type, index) => ({
        type,
        name: SERVICE_NAMES[type],
        status: index === 0 ? "inProgress" : "waiting",
      })
    );

    setServices(ordered);
    setIsServiceStarted(true);
    setCurrentServiceIndex(0);
    setShowConfirmDialog(false);
  };

  // 서비스 취소 요청
  const handleCancel = () => {
    const allCompleted = services.every((s) => s.status === "completed");

    if (allCompleted) {
      alert("모든 서비스가 완료되었습니다.");
      return;
    }
    setShowCancelDialog(true);
  };

  // 대기중 서비스만 취소 처리
  const handleCancelConfirm = () => {
    setServices((prev) =>
      prev.map((s) => (s.status === "waiting" ? { ...s, status: "cancelled" } : s))
    );
    setShowCancelDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "bg-gray-500";
      case "inProgress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "waiting":
        return "대기중";
      case "inProgress":
        return "진행중";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <div className="text-sm text-gray-500">선택된 차량</div>
          <div>{selectedVehicle}</div>
        </div>
      </div>

      {/* 서비스 선택 UI */}
      <div className="p-4">
        <h2 className="text-gray-700 mb-4">이용할 서비스 선택</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button
            variant={selectedServices.has("parking") ? "default" : "outline"}
            disabled={isServiceStarted}
            className="h-20"
            onClick={() => toggleService("parking")}
          >
            주차
          </Button>

          <Button
            variant={selectedServices.has("carwash") ? "default" : "outline"}
            disabled={isServiceStarted}
            className="h-20"
            onClick={() => toggleService("carwash")}
          >
            세차
          </Button>

          <Button
            variant={selectedServices.has("maintenance") ? "default" : "outline"}
            disabled={isServiceStarted}
            className="h-20"
            onClick={() => toggleService("maintenance")}
          >
            정비
          </Button>
        </div>

        {/* 서비스 시작/취소 버튼 */}
        {!isServiceStarted ? (
          <Button className="w-full" onClick={handleSubmit}>
            전송
          </Button>
        ) : (
          <Button className="w-full" variant="destructive" onClick={handleCancel}>
            취소
          </Button>
        )}

        {/* 서비스 진행 상황 표시 */}
        {services.length > 0 && (
          <div className="mt-6">
            <h3 className="text-gray-700 mb-3">서비스 진행 현황</h3>

            <Card>
              <CardContent className="p-4 space-y-3">
                {services.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span>{s.name}</span>
                    <Badge className={getStatusColor(s.status)}>{getStatusText(s.status)}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 서비스 시작 확인 다이얼로그 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>서비스 확인</AlertDialogTitle>
            <AlertDialogDescription>
              다음 서비스를 시작하시겠습니까?
              <div className="mt-3 space-y-2">
                {Array.from(selectedServices).map((t) => (
                  <div key={t} className="p-2 bg-gray-100 rounded">
                    • {SERVICE_NAMES[t]}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-red-600">서비스가 시작되면 수정할 수 없습니다.</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 취소 확인 다이얼로그 */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>서비스 취소</AlertDialogTitle>
            <AlertDialogDescription>
              아직 완료되지 않은 서비스가 있습니다.
              <br />
              <strong>대기중 서비스만 취소</strong>됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>돌아가기</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
