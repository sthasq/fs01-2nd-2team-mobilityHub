import React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const AmountChart = () => {
  // XAxis의 DataKey 커스텀
  const formatXAxisLabel = (value: number) => `${value}주차`;

  return (
    <div style={{ marginTop: "30px" }}>
      <h1>2023년도 사용자 추이</h1>
      <ResponsiveContainer width={"100%"} height={400}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="count" stroke="#2D8CFF" strokeWidth={2} />
          <XAxis
            dataKey="weekNumber"
            height={140}
            tickFormatter={formatXAxisLabel}
            tickMargin={10}
            tickLine={false}
            padding={{ left: 13, right: 13 }}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AmountChart;
