import React, { useEffect, useState } from "react";
import "../style/StatisticsSection.css";
import { getRepairAmount } from "../../api/repairAPI";
import UseByArea from "../chart/UseByArea";
import { getWorkInfoList } from "../../api/workInfoAPI";
import StatisticsByDateChart from "../chart/StatisticsByDateChart";

export default function StatisticsSection() {
  // 기간 상태
  const [periodType, setPeriodType] = useState("daily");
  const [repairAmount, setRepairAmount] = useState([]);

  // 작업 목록 가져오기
  const [workList, setWorkList] = useState([]);

  useEffect(() => {
    getRepairAmount()
      .then((res) => {
        setRepairAmount(res.data);
      })
      .catch((err) => console.error("월별 금액 조회중 오류 발생", err));
  }, []);

  useEffect(() => {
    getWorkInfoList()
      .then((res) => {
        setWorkList(res);
      })
      .catch((err) => console.log("작업 목록 가져오기 실패: ", err));
  }, []);

  // 일별 통계
  const dailyData = workList.reduce((acc, item) => {
    if (!item.entryTime) return acc;
    const hour = new Date(item.entryTime).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  // 배열로 변환
  const dailyArray = [];
  for (let hour = 0; hour < 24; hour++) {
    dailyArray.push({ time: `${hour}:00`, count: dailyData[hour] || 0 });
  }

  // 월별 통계
  const monthlyData = workList.reduce((acc, item) => {
    if (!item.entryTime) return acc;
    const day = new Date(item.entryTime).getDate();
    const week = Math.ceil(day / 7); // 1~4주
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  const monthlyArray = [];
  for (let week = 1; week <= 4; week++) {
    monthlyArray.push({ day: `${week}주`, count: monthlyData[week] || 0 });
  }

  // 연별 통계
  const yearlyData = workList.reduce((acc, item) => {
    if (!item.entryTime) return acc;
    const month = new Date(item.entryTime).getMonth() + 1; // 0~11 → 1~12
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const yearlyArray = [];
  for (let month = 1; month <= 12; month++) {
    yearlyArray.push({ month: `${month}월`, count: yearlyData[month] || 0 });
  }

  // 현재 선택한 기간의 데이터 반환
  const getCurrentData = () => {
    if (periodType === "daily") return dailyArray;
    if (periodType === "monthly") return monthlyArray;
    if (periodType === "yearly") return yearlyArray;
    return dailyArray;
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

  console.log("금액: ", repairAmount);
  const total = (repairAmount || []).reduce((sum, r) => sum + r.repairAmount, 0);

  return (
    <div className="statistics-page">
      {/* ------------------------ 상단 SUMMARY ------------------------ */}
      <div className="summary-row">
        <div className="summary-card">
          <p className="summary-title">오늘 총 이용량</p>
          <p className="summary-value">총 이용량</p>
        </div>

        <div className="summary-card">
          <p className="summary-title">이번 달 매출</p>
          <p className="summary-value">{total.toLocaleString("ko-KR")}</p>
        </div>

        <div className="summary-card">
          <p className="summary-title">평균 체류시간</p>
          <p className="summary-value">시간</p>
        </div>
      </div>

      {/* ------------------------ 중단: 그래프 2개 ------------------------ */}
      <div className="chart-container">
        <div className="chart-box">
          <div className="use-area">
            <h3 className="use-area-chart-title">{getPeriodLabel()} 통계</h3>
            <div className="use-area-chart">
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
        <div className="line-chart">
          <StatisticsByDateChart data={getCurrentData()} xKey={getXAxisKey()} />
        </div>
      </div>

      <div className="chart-box">
        <h3 className="chart-title">금일 이용회원 (구역별)</h3>
        <div className="chart-placeholder">여기에 막대 그래프 들어갈 자리</div>
      </div>

      {/* ------------------------ 하단 영역 ------------------------ */}
    </div>
  );
}
