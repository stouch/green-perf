"use client";

import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { FundPeriodSummary } from "../../types/shared/fund";
import { deltaBetweenInPercent } from "../includes/utils";
import dayjs from "dayjs";
import nextConfig from "../../next.config";
import { Tooltip } from "@nextui-org/tooltip";

const roundValues = (value: number) => {
  return Math.round(value * 100) / 100; // round with 2 decimal (10^2);
};

const RankingTooltip = ({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) => {
  return (
    <Tooltip
      content={content}
      offset={0}
      placement="left"
      delay={10}
      closeDelay={10}
      showArrow={true}
    >
      <div className="inline-flex gap-2">{children}</div>
    </Tooltip>
  );
};

export const RankedFunds = () => {
  const rankingData = useQuery<FundPeriodSummary[]>(["ranking"], async () => {
    const response = await fetch(`${nextConfig.basePath}/api/funds/ranking`);
    return await response.json();
  });
  const wPerCol = ["w-12", "w-96", "w-32", "w-32", "w-32", "w-32", "w-32"];
  return (
    <div className="w-full">
      <div className="flex flex-row gap-3 my-4">
        <div className={wPerCol[0]}>#</div>
        <div className={wPerCol[1]}>Nom</div>
        <div className={wPerCol[2]}>7j</div>
        <div className={wPerCol[3]}>30j ▲</div>
        <div className={wPerCol[4]}>6M.</div>
        <div className={wPerCol[5]}>1A.</div>
        <div className={wPerCol[6]}>2A.</div>
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
          const oneYearDelta = deltaBetweenInPercent({
            from: summary.one_year_low_value,
            to: summary.yesterday_high_value,
          });
          const twoYearsDelta = deltaBetweenInPercent({
            from: summary.two_year_low_value,
            to: summary.yesterday_high_value,
          });

          const yesterdayToLabel = `${roundValues(
            summary.yesterday_high_value
          )} (${dayjs(summary.yesterday_date).format("D/M/YY")})`;
          const oneWeekDeltaLabel = `${roundValues(
            summary.thirty_days_low_value
          )} (${dayjs(summary.seven_days_date).format(
            "D/M/YY"
          )}) -> ${yesterdayToLabel})`;
          const oneMonthDeltaLabel = `${roundValues(
            summary.seven_days_low_value
          )} (${dayjs(summary.thirty_days_date).format(
            "D/M/YY"
          )}) -> ${yesterdayToLabel})`;
          const sixMonthDeltaLabel = `${roundValues(
            summary.six_month_low_value
          )} (${dayjs(summary.six_month_date).format(
            "D/M/YY"
          )}) -> ${yesterdayToLabel})`;
          const oneYearDeltaLabel = `${roundValues(
            summary.one_year_low_value
          )} (${dayjs(summary.one_year_date).format(
            "D/M/YY"
          )}) -> ${yesterdayToLabel})`;
          const twoYearDeltaLabel = `${roundValues(
            summary.two_year_low_value
          )} (${dayjs(summary.two_year_date).format(
            "D/M/YY"
          )}) -> ${yesterdayToLabel})`;

          return (
            <div
              key={summary.name}
              className="flex flex-row gap-3 my-4 text-sm"
            >
              <div className={wPerCol[0]}>{summary.position}</div>
              <div className={wPerCol[1]}>{summary.name}</div>
              <div className={`${wPerCol[2]} flex flex-row gap-2 items-center`}>
                <RankingTooltip content={oneWeekDeltaLabel}>
                  <span
                    className={oneWeekDelta > 0 ? "text-green" : "text-red"}
                  >
                    {oneWeekDelta > 0 ? "+" : ""}
                    {oneWeekDelta}%
                  </span>
                  {/*<small>(7j)</small>*/}
                </RankingTooltip>
              </div>
              <div className={`${wPerCol[3]} flex flex-row items-center`}>
                <RankingTooltip content={oneMonthDeltaLabel}>
                  <span
                    className={oneMonthDelta > 0 ? "text-green" : "text-red"}
                  >
                    {oneMonthDelta > 0 ? "+" : ""}
                    {oneMonthDelta}%
                  </span>
                  {/*<small>(30j)</small>*/}
                </RankingTooltip>
              </div>
              <div className={`${wPerCol[4]} flex flex-row gap-2 items-center`}>
                <RankingTooltip content={sixMonthDeltaLabel}>
                  <span
                    className={sixMonthDelta > 0 ? "text-green" : "text-red"}
                  >
                    {sixMonthDelta > 0 ? "+" : ""}
                    {sixMonthDelta}%
                  </span>
                  {/*<small>(6 mois)</small>*/}
                </RankingTooltip>
              </div>
              <div className={`${wPerCol[5]} flex flex-row gap-2 items-center`}>
                <RankingTooltip content={oneYearDeltaLabel}>
                  <span
                    className={oneYearDelta > 0 ? "text-green" : "text-red"}
                  >
                    {oneYearDelta > 0 ? "+" : ""}
                    {oneYearDelta}%
                  </span>
                  {/*<small>(1a)</small>*/}
                </RankingTooltip>
              </div>
              <div className={`${wPerCol[6]} flex flex-row gap-2 items-center`}>
                <RankingTooltip content={twoYearDeltaLabel}>
                  <span
                    className={twoYearsDelta > 0 ? "text-green" : "text-red"}
                  >
                    {twoYearsDelta > 0 ? "+" : ""}
                    {twoYearsDelta}%
                  </span>
                  {/*<small>(2a)</small>*/}
                </RankingTooltip>
              </div>
            </div>
          );
        })}
    </div>
  );
};
