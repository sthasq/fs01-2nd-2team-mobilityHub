import React from "react";
import customTheme from "./theme.js";
import { VictoryBar, VictoryChart, VictoryLabel } from "victory";

const CarWashBarChart = ({ carWashValues }) => {
  // 0~23시 기본 구조 만들기
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // 시간대별 데이터
  const hourCounts = carWashValues.reduce((acc, item) => {
    const hour = new Date(item.requestTime).getHours();

    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  // 차트에 사용할 데이터 포맷
  const data = hours.map((hour) => ({
    x: `${hour.toString().padStart(2, "0")}:00`,
    y: hourCounts[hour] || 0,
  }));

  return (
    <div style={{ overflowX: "auto" }}>
      <VictoryChart
        theme={customTheme}
        width={1200} // 원하는 너비
        height={250}
      >
        <VictoryBar
          data={data}
          x="x"
          labels={({ datum }) => datum.y}
          labelComponent={<VictoryLabel dy={-10} />}
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseOver: () => {
                  return [
                    {
                      target: "labels",
                      mutation: () => ({ active: true }), // 툴팁 활성화
                    },
                  ];
                },
                onMouseOut: () => {
                  return [
                    {
                      target: "labels",
                      mutation: () => ({ active: false }),
                    },
                  ];
                },
              },
            },
          ]}
        />
      </VictoryChart>
    </div>
  );
};

export default CarWashBarChart;
