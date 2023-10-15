"use client";

import { useQuery } from "@tanstack/react-query";
import { FundPeriodSummary } from "../../types/shared/fund";

export const RankedFunds = () => {
  const rankingData = useQuery<FundPeriodSummary[]>(["ranking"], async () => {
    const response = await fetch(`http://localhost:3000/api/funds/ranking`);
    return await response.json();
  });
  return (
    <div className="w-full">
      {rankingData.isSuccess &&
        rankingData.data.map((summary) => <div>{summary.name}</div>)}
    </div>
  );
};
