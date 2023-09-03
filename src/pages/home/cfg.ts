// export const dealChartData = (
//   dataCfg: Record<string, Record<string, number>>
// ) => {
//   return Object.entries(dataCfg).reduce(
//     (acc, [metricName, valuesByDimension]) => {
//       const xAxisData = Object.keys(valuesByDimension);
//       const data = Object.values(valuesByDimension);

//       return {
//         xAxisData,
//         chartData: {
//           ...(acc.chartData || {}),
//           [metricName]: data,
//         },
//       };
//     },
//     {
//       xAxisData: [],
//       chartData: {},
//     }
//   );
// };

const dealChartData = (dataCfg: Record<string, Record<string, number>>) => {
  return Object.entries(dataCfg).reduce(
    (acc, [dimensionName, metricValues]) => {
      const metricResult = { ...(acc.chartData || {}) };

      Object.entries(metricValues).forEach(([metricName, metricValue]) => {
        metricResult[metricName] = (metricResult[metricName] || []).concat(
          metricValue
        );
      });

      return {
        xAxisData: [...(acc.xAxisData || []), dimensionName],
        chartData: metricResult,
      };
    },
    {
      xAxisData: [],
      chartData: {},
    }
  );
};

export const getBarOption = (
  dataCfg: Record<string, Record<string, number>>
) => {
  const { xAxisData = [], chartData = {} } = dealChartData(dataCfg) || {};
  return {
    legend: {},
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      bottom: 30,
      right: 15,
      top: 60,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
    },
    series: Object.entries(chartData).map(([name, data]) => ({
      name,
      data,
      type: "bar",
    })),
  };
};

export const getLineOption = (
  dataCfg: Record<string, Record<string, number>>
) => {
  const { xAxisData = [], chartData = {} } = dealChartData(dataCfg) || {};

  return {
    legend: {
      icon: "roundRect",
      itemHeight: 2,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      bottom: 30,
      top: 60,
      right: 15,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
    },
    series: Object.entries(chartData).map(([name, data]) => ({
      name,
      data,
      type: "line",
    })),
  };
};

export const lineOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  grid: {
    bottom: 30,
    top: 30,
    right: 15,
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "line",
    },
    {
      data: [100, 180, 120, 21, 65, 32, 98],
      type: "line",
    },
    {
      data: [80, 160, 142, 70, 60, 11, 13],
      type: "line",
    },
    {
      data: [90, 132, 78, 98, 54, 32, 78],
      type: "line",
    },
  ],
};

export default {};
