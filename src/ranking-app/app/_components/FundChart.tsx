"use client";

import { useQuery } from "@tanstack/react-query";
import { Candlestick } from "../../components/charts/Candlestick";
import { FundData } from "../../types/shared/fund";
import { LoadingChart } from "../../components/charts/LoadingChart";
import nextConfig from "../../next.config";

export const FundChart = ({ id }: { id: string }) => {
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
    <div className="w-full">
      {chartData.isSuccess ? (
        <div>
          {chartData.data.name}
          <Candlestick name={id} fundDays={chartData.data.histo} />
        </div>
      ) : (
        <LoadingChart />
      )}
    </div>
  );
};
