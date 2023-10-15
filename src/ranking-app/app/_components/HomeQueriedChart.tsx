"use client";

import { useQuery } from "@tanstack/react-query";
import { Candlestick } from "../../components/charts/Candlestick";
import { FundDayData } from "../../types/shared/fund";
import { LoadingChart } from "../../components/charts/LoadingChart";

export const HomeQueriedChart = ({ id }: { id: string }) => {
  const chartData = useQuery<FundDayData[]>(
    ["chart", id],
    async () => {
      const response = await fetch(
        `http://localhost:3000/api/funds/${id}/histo`
      );
      return await response.json();
    },
    {
      enabled: !!id,
    }
  );
  return (
    <div className="w-full">
      {chartData.isSuccess ? (
        <Candlestick name={id} fundDays={chartData.data} />
      ) : (
        <LoadingChart />
      )}
    </div>
  );
};
