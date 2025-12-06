import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ChevronLeft } from "lucide-react";

export default function UsageHistory({ userId, onBack }) {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  // 🔥 필터 상태값
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPlate, setSelectedPlate] = useState("all");

  useEffect(() => {
    loadHistory();
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [history, startDate, endDate, selectedPlate]);

  const loadHistory = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userHistory = users[userId]?.history || [];

    // 샘플 데이터 주입 (처음 띄울 때만)
    if (userHistory.length === 0) {
      const sample = [
        {
          id: "1",
          plateNumber: "12가3456",
          date: "2025-11-28",
          services: ["주차", "세차"],
          payment: 15000,
        },
        {
          id: "2",
          plateNumber: "78나9012",
          date: "2025-11-25",
          services: ["주차", "세차", "정비"],
          payment: 85000,
        },
        {
          id: "3",
          plateNumber: "12가3456",
          date: "2025-11-20",
          services: ["주차"],
          payment: 5000,
        },
      ];

      users[userId].history = sample;
      localStorage.setItem("users", JSON.stringify(users));
      setHistory(sample);
    } else {
      setHistory(userHistory);
    }
  };

  // 🔥 필터 적용 함수
  const applyFilters = () => {
    let data = [...history];

    // 차량 필터
    if (selectedPlate !== "all") {
      data = data.filter((item) => item.plateNumber === selectedPlate);
    }

    // 날짜 필터
    if (startDate) {
      data = data.filter((item) => item.date >= startDate);
    }
    if (endDate) {
      data = data.filter((item) => item.date <= endDate);
    }

    setFilteredHistory(data);
  };

  // 차량번호 리스트 생성
  const plateList = [...new Set(history.map((h) => h.plateNumber))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="size-5" />
        </Button>
        <div>
          <div className="text-sm text-gray-500">로그인 사용자</div>
          <div>{userId}</div>
        </div>
      </div>

      {/* 본문 */}
      <div className="p-4">
        <h2 className="text-gray-700 mb-4">주차장 이용 내역</h2>

        {/* 🔥 필터 UI */}
        <Card className="mb-4">
          <CardContent className="space-y-3 p-4">
            {/* 차량별 조회 */}
            <div>
              <div className="text-sm mb-1">차량 선택</div>
              <select
                className="w-full border p-2 rounded"
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
              >
                <option value="all">전체 차량</option>
                {plateList.map((plate) => (
                  <option key={plate} value={plate}>
                    {plate}
                  </option>
                ))}
              </select>
            </div>

            {/* 날짜별 조회 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm mb-1">시작 날짜</div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <div className="text-sm mb-1">종료 날짜</div>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <Button className="w-full" onClick={applyFilters}>
              필터 적용
            </Button>
          </CardContent>
        </Card>

        {/* 🔥 필터링된 데이터 출력 */}
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              조회된 내역이 없습니다.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.plateNumber}</span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  {/* 이용 서비스 */}
                  <div>
                    <div className="text-sm text-gray-500 mb-1">이용 서비스</div>
                    <div className="flex gap-2 flex-wrap">
                      {item.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 결제 금액 */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-gray-600">결제 금액</span>
                    <span className="text-lg">{item.payment.toLocaleString()}원</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
