import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, DollarSign, UserPlus } from "lucide-react";

// JSX 전용 컴포넌트로 변환된 StatisticsSection
export function StatisticsSection() {
  // 기간 상태 (TS 타입 제거)
  const [periodType, setPeriodType] = useState("daily");

  // 일별 이용량 데이터
  const dailyData = [
    { time: "00:00", count: 5 },
    { time: "03:00", count: 3 },
    { time: "06:00", count: 8 },
    { time: "09:00", count: 15 },
    { time: "12:00", count: 22 },
    { time: "15:00", count: 28 },
    { time: "18:00", count: 32 },
    { time: "21:00", count: 18 },
  ];

  // 월별 이용량 데이터
  const monthlyData = [
    { day: "1주", count: 120 },
    { day: "2주", count: 145 },
    { day: "3주", count: 168 },
    { day: "4주", count: 152 },
  ];

  // 연별 이용량 데이터
  const yearlyData = [
    { month: "1월", count: 480 },
    { month: "2월", count: 520 },
    { month: "3월", count: 580 },
    { month: "4월", count: 610 },
    { month: "5월", count: 650 },
    { month: "6월", count: 620 },
    { month: "7월", count: 680 },
    { month: "8월", count: 720 },
    { month: "9월", count: 690 },
    { month: "10월", count: 710 },
    { month: "11월", count: 740 },
    { month: "12월", count: 700 },
  ];

  // 구역별 사용 빈도 데이터
  const areaUsageData = [
    { name: "입출구", value: 450, color: "#3b82f6" },
    { name: "세차장", value: 180, color: "#10b981" },
    { name: "정비존", value: 95, color: "#f59e0b" },
    { name: "주차장", value: 275, color: "#8b5cf6" },
  ];

  // 신규 회원 수
  const newMembersData = [
    { month: "1월", count: 12 },
    { month: "2월", count: 15 },
    { month: "3월", count: 18 },
    { month: "4월", count: 22 },
    { month: "5월", count: 20 },
    { month: "6월", count: 25 },
    { month: "7월", count: 28 },
    { month: "8월", count: 30 },
    { month: "9월", count: 26 },
    { month: "10월", count: 29 },
    { month: "11월", count: 32 },
    { month: "12월", count: 27 },
  ];

  // 매출 데이터
  const revenueData = [
    { month: "1월", revenue: 12400000 },
    { month: "2월", revenue: 13200000 },
    { month: "3월", revenue: 14100000 },
    { month: "4월", revenue: 15600000 },
    { month: "5월", revenue: 16200000 },
    { month: "6월", revenue: 15800000 },
    { month: "7월", revenue: 17400000 },
    { month: "8월", revenue: 18200000 },
    { month: "9월", revenue: 17100000 },
    { month: "10월", revenue: 18500000 },
    { month: "11월", revenue: 19200000 },
    { month: "12월", revenue: 17900000 },
  ];

  // 현재 선택한 기간의 데이터 반환
  const getCurrentData = () => {
    if (periodType === "daily") return dailyData;
    if (periodType === "monthly") return monthlyData;
    if (periodType === "yearly") return yearlyData;
    return dailyData;
  };

  // X축 key 선택
  const getXAxisKey = () => {
    if (periodType === "daily") return "time";
    if (periodType === "monthly") return "day";
    if (periodType === "yearly") return "month";
    return "time";
  };

  // 차트 제목
  const getPeriodLabel = () => {
    if (periodType === "daily") return "일별 이용량";
    if (periodType === "monthly") return "월별 이용량";
    if (periodType === "yearly") return "연별 이용량";
    return "이용량";
  };

  return (
    <div className="p-6 space-y-6">
      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">오늘 총 이용량</p>
              <p className="text-gray-900 mt-2">132건</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">이번 달 이용량</p>
              <p className="text-gray-900 mt-2">3,245건</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">평균 체류시간</p>
              <p className="text-gray-900 mt-2">2.5시간</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 기간별 이용량 그래프 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">{getPeriodLabel()} 통계</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriodType("daily")}
                className={`px-4 py-2 rounded-lg ${
                  periodType === "daily" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                일별
              </button>
              <button
                onClick={() => setPeriodType("monthly")}
                className={`px-4 py-2 rounded-lg ${
                  periodType === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                월별
              </button>
              <button
                onClick={() => setPeriodType("yearly")}
                className={`px-4 py-2 rounded-lg ${
                  periodType === "yearly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                연별
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={getXAxisKey()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="이용량"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 신규 회원 & 매출 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 신규 회원 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">월별 신규 등록 회원</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={newMembersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" name="신규 회원" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 매출 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">월별 정산 내역</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₩${Number(value).toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="매출"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
