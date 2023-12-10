"use client";

import { useQuery } from "@tanstack/react-query";
import { FundPeriodSummary } from "../../types/shared/fund";
import { deltaBetweenInPercent } from "../includes/utils";
import dayjs from "dayjs";

export const RankedFunds = () => {
  const rankingData = useQuery<FundPeriodSummary[]>(["ranking"], async () => {
    const response = await fetch(`http://localhost:3000/api/funds/ranking`);
    return await response.json();
  });
  return (
    <div className="w-full">
      <div className="flex flex-row gap-3 my-4">
        <div className="w-12">#</div>
        <div className="w-96">Nom</div>
        <div className="w-24">7j</div>
        <div className="w-32">30j ▲</div>
        <div className="w-48">6M.</div>
      </div>
      {rankingData.isSuccess &&
        rankingData.data.map((summary) => {
          const oneWeekDelta = deltaBetweenInPercent({
            from: summary.seven_days_low_value,
            to: summary.yesterday_high_value,
          });
          const oneMonthDelta = deltaBetweenInPercent({
            from: summary.thirty_days_low_value,
            to: summary.yesterday_high_value,
          });
          const sixMonthDelta = deltaBetweenInPercent({
            from: summary.six_month_low_value,
            to: summary.yesterday_high_value,
          });

          const yesterdayToLabel = `${summary.yesterday_high_value} (${dayjs(
            summary.yesterday_date
          ).format("D/M/YY")})`;

          const oneWeekDeltaLabel = `${summary.thirty_days_low_value} (${dayjs(
            summary.seven_days_date
          ).format("D/M/YY")}) -> ${yesterdayToLabel})`;
          const oneMonthDeltaLabel = `${summary.seven_days_low_value} (${dayjs(
            summary.thirty_days_date
          ).format("D/M/YY")}) -> ${yesterdayToLabel})`;
          const sixMonthDeltaLabel = `${summary.six_month_low_value} (${dayjs(
            summary.six_month_date
          ).format("D/M/YY")}) -> ${yesterdayToLabel})`;

          return (
            <div className="flex flex-row gap-3 my-4">
              <div className="w-12">{summary.position}</div>
              <div className="w-96">{summary.name}</div>
              <div
                title={oneWeekDeltaLabel}
                className="w-24 flex flex-row gap-2 items-center"
              >
                <span className={oneWeekDelta > 0 ? "text-green" : "text-red"}>
                  {oneWeekDelta > 0 ? "+" : ""}
                  {oneWeekDelta}%
                </span>
                <small>(7j)</small>
              </div>
              <div
                title={oneMonthDeltaLabel}
                className="w-32 flex flex-row gap-2 items-center"
              >
                <span className={oneMonthDelta > 0 ? "text-green" : "text-red"}>
                  {oneMonthDelta > 0 ? "+" : ""}
                  {oneMonthDelta}%
                </span>
                <small>(30j)</small>
              </div>
              <div
                title={sixMonthDeltaLabel}
                className="w-48 flex flex-row gap-2 items-center"
              >
                <span className={sixMonthDelta > 0 ? "text-green" : "text-red"}>
                  {sixMonthDelta > 0 ? "+" : ""}
                  {sixMonthDelta}%
                </span>
                <small>(6 mois)</small>
              </div>
            </div>
          );
        })}
    </div>
  );
};
