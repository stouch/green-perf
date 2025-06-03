"use client";

import { FundDayData } from "../../types/shared/fund";
import * as echarts from "echarts/core";
import ReactEcharts from "echarts-for-react";
import dayjs, { Dayjs } from "dayjs";

export const LineChart = ({
  name,
  fundDays,
  startDate,
}: {
  name: string;
  fundDays: FundDayData[];
  startDate: Dayjs;
}) => {
  const upColor = "#00da3c";
  const downColor = "#ec0000";

  const splitData = (
    fundDays: FundDayData[]
  ): {
    days: string[];
    values: number[];
  } => {
    const firstDayOfData = dayjs(fundDays[0].date);

    const daysUntilFirstDayOfData: string[] = [];
    const zeroValuesUntilFirstDayOfData: number[] = [];

    const aDayBeforeFirstDayOfData = dayjs(firstDayOfData).subtract(1, "day");
    let currentDate = dayjs(startDate);
    while (currentDate.isBefore(aDayBeforeFirstDayOfData)) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      daysUntilFirstDayOfData.push(dateStr);
      zeroValuesUntilFirstDayOfData.push(0);
      currentDate = currentDate.add(1, "day");
    }

    return {
      days: [...daysUntilFirstDayOfData, ...fundDays.map((day) => day.date)],
      values: [
        ...zeroValuesUntilFirstDayOfData,
        ...fundDays.map((day) => day.close_value),
      ],
    };
  };

  const data = splitData(fundDays);
  return (
    <ReactEcharts
      style={{ height: "100%" }}
      echarts={echarts}
      lazyUpdate={true}
      notMerge={true}
      option={{
        animation: false,
        tooltip: {
          trigger: "axis",
          formatter: function (params: any) {
            const date = params[0].axisValue;
            const value = params[0].data;
            return `${date}<br/>${value}`;
          },
        },
        grid: {
          left: "0%",
          right: "2%",
          bottom: "3%",
          top: "18px",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: data.days,
          boundaryGap: false,
          axisLine: { onZero: true },
          splitLine: { show: false },
          min: dayjs().subtract(4, "y").format("YYYY-MM-DD"),
          max: dayjs().format("YYYY-MM-DD"),
          axisLabel: {
            formatter: (value: string) => dayjs(value).format("YYYY-MM-DD"),
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              opacity: 0.2,
            },
          },
        },
        series: [
          {
            name: name,
            type: "line",
            data: data.values,
            itemStyle: {
              color: upColor,
            },
            lineStyle: {
              width: 2,
            },
            symbol: "circle",
            symbolSize: 0,
          },
        ],
      }}
    />
  );
};
