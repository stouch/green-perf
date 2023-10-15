'use client'

import { FundDayData } from "../../types/shared/fund";
import * as echarts from "echarts/core";
import ReactEcharts from "echarts-for-react";

export const Candlestick = ({
  name,
  fundDays,
}: {
  name: string;
  fundDays: FundDayData[];
}) => {
  const upColor = "#00da3c";
  const downColor = "#ec0000";

  // https://echarts.apache.org/en/option.html#series-candlestick.data.valuec
  const splitData = (
    fundDays: FundDayData[]
  ): {
    days: string[];
    values: [number, number, number, number][]; // open, close, high, low,
    volumes: [number, number, 1 | -1][]; // idx, value, pos|neg
  } => {
    let categoryData = [];
    let values: [number, number, number, number][] = [];
    let volumes: [number, number, 1 | -1][] = [];
    for (let i = 0; i < fundDays.length; i++) {
      const dayData = fundDays[i];
      categoryData.push(dayData.date);
      values.push([
        dayData.open_value,
        dayData.close_value,
        dayData.high_value,
        dayData.low_value,
      ]);
      volumes.push([
        i,
        dayData.volume || 0,
        dayData.open_value > dayData.close_value ? 1 : -1,
      ]);
    }
    return {
      days: categoryData,
      values: values,
      volumes: volumes,
    };
  };
  const data = splitData(fundDays);
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <ReactEcharts
        echarts={echarts}
        lazyUpdate={true}
        notMerge={true}
        option={{
          animation: false,
          legend: {
            bottom: 10,
            left: "center",
            data: [name],
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
            },
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            textStyle: {
              color: "#000",
            },
            /*position: function (pos, params, el, elRect, size) {
          const obj = {
            top: 10
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        }*/
            // extraCssText: 'width: 170px'
          },
          axisPointer: {
            link: [
              {
                xAxisIndex: "all",
              },
            ],
            label: {
              backgroundColor: "#777",
            },
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: false,
              },
              brush: {
                type: ["lineX", "clear"],
              },
            },
          },
          brush: {
            xAxisIndex: "all",
            brushLink: "all",
            outOfBrush: {
              colorAlpha: 0.1,
            },
          },
          visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [
              {
                value: 1,
                color: downColor,
              },
              {
                value: -1,
                color: upColor,
              },
            ],
          },
          grid: [
            {
              left: "10%",
              right: "8%",
              height: "50%",
            },
            {
              left: "10%",
              right: "8%",
              top: "63%",
              height: "16%",
            },
          ],
          xAxis: [
            {
              type: "category",
              data: data.days,
              boundaryGap: false,
              axisLine: { onZero: false },
              splitLine: { show: false },
              min: "dataMin",
              max: "dataMax",
              axisPointer: {
                z: 100,
              },
            },
            {
              type: "category",
              gridIndex: 1,
              data: data.days,
              boundaryGap: false,
              axisLine: { onZero: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              min: "dataMin",
              max: "dataMax",
            },
          ],
          yAxis: [
            {
              scale: true,
              splitArea: {
                show: true,
              },
            },
            {
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
              axisLabel: { show: false },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
            },
          ],
          dataZoom: [
            {
              type: "inside",
              xAxisIndex: [0, 1],
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: "slider",
              top: "85%",
            },
          ],
          series: [
            {
              name: name,
              type: "candlestick",
              data: data.values,
              itemStyle: {
                color: upColor,
                color0: downColor,
                borderColor: undefined,
                borderColor0: undefined,
              },
            },
            {
              name: "Volume",
              type: "bar",
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data.volumes,
            },
          ],
        }}
      />
    </div>
  );
};
