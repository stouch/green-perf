"use client";

import { useQuery } from "@tanstack/react-query";
import { LineChart } from "../../components/charts/Linechart";
import { FundData } from "../../types/shared/fund";
import { LoadingChart } from "../../components/charts/LoadingChart";
import nextConfig from "../../next.config";
import { Dayjs } from "dayjs";

export const FundChart = ({
  id,
  startDate,
}: {
  id: string;
  startDate: Dayjs;
}) => {
  const chartData = useQuery<FundData>(
    ["chart", id],
    async () => {
      const response = await fetch(`${nextConfig.basePath}/api/funds/${id}`);
      return await response.json();
    },
    {
      enabled: !!id,
    }
  );
  return (
    <div className="w-full h-full">
      {chartData.isSuccess ? (
        <>
          {/* chartData.data.name */}
          <LineChart
            name={id}
            fundDays={chartData.data.histo}
            startDate={startDate}
          />
        </>
      ) : (
        <LoadingChart />
      )}
    </div>
  );
};
