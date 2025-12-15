import React from "react";
import { Chart } from "react-google-charts";

const InOutLineChart = ({ data = [] }) => {
  const options = {
    hAxis: {
      title: "시간",
      format: "##시",
    },
    vAxis: {
      title: "차량 수",
    },
    legend: { position: "bottom" },
  };

  return <Chart chartType="LineChart" width="100%" height="400px" data={data} options={options} />;
};

export default InOutLineChart;
