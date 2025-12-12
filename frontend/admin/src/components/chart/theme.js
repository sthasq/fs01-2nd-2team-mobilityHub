const customTheme = {
  axis: {
    style: {
      grid: {
        stroke: "none", // 그리드 제거
      },
      axis: {
        stroke: "transparent", // 기본 축 선 제거 (Victory가 자동으로 x축은 표현 안 해도 보여줌)
      },
      ticks: {
        stroke: "transparent", // 공통 tick 제거
      },
      tickLabels: {
        fill: "#292929", // 기본 라벨 유지 (x축)
      },
    },
  },

  dependentAxis: {
    // Y축만 따로 숨김
    style: {
      tickLabels: {
        fill: "transparent", // Y축 숫자 숨김
      },
      axis: {
        stroke: "transparent", // Y축 선 숨김
      },
      ticks: {
        stroke: "transparent", // Y축 tick 숨김
      },
      grid: {
        stroke: "none", // Y축 그리드 제거
      },
    },
  },

  bar: {
    style: {
      data: {
        fill: "#2D7FF9",
        padding: 8,
        strokeWidth: 0,
        fillOpacity: 0.5,
      },
      labels: {
        fontFamily: "'Inter', 'Helvetica Neue', 'Seravek', 'Helvetica', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        letterSpacing: "normal",
        padding: 8,
        fill: "#292929",
        stroke: "transparent",
      },
    },
    cornerRadius: {
      top: 1,
    },
    padding: 60,
    colorScale: [
      "#2D7FF9",
      "#18BFFF",
      "#20C933",
      "#FCB400",
      "#FF6F2C",
      "#F82B60",
      "#8B46FF",
      "#20D9D2",
    ],
  },
};

export default customTheme;
