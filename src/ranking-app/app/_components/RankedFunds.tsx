"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FundPeriodSummary, FundSource } from "../../types/shared/fund";
import { deltaBetweenInPercent } from "../includes/utils";
import dayjs from "dayjs";
import nextConfig from "../../next.config";
import { Tooltip } from "@nextui-org/tooltip";
import Image from "next/image";
import { FundChart } from "./FundChart";

const roundValues = (value: number) => {
  return Math.round(value * 100) / 100; // round with 2 decimal (10^2);
};

const RankingMetric = ({
  metric,
  deltaLabel,
}: {
  metric: number; // metric c Z
  deltaLabel: string;
}) => {
  return (
    <Tooltip
      content={deltaLabel}
      offset={0}
      placement="left"
      delay={10}
      closeDelay={10}
      showArrow={true}
    >
      <div className="inline-flex gap-2">
        <span
          className={
            metric > 0 ? "text-green-700 dark:text-green-500" : "text-red-500"
          }
        >
          {metric > 0 ? "+" : ""}
          {metric}%
        </span>
      </div>
    </Tooltip>
  );
};

const FundLink = ({
  source,
  fundId,
  children,
}: {
  source: FundSource;
  fundId: string;
  children: ReactNode;
}) => {
  const link =
    source === "yahoo"
      ? `https://finance.yahoo.com/quote/${fundId}`
      : source === "boursorama"
      ? `https://www.boursorama.com/bourse/opcvm/cours/${fundId}`
      : `https://www.quantalys.com/Fonds/${fundId}`;
  return (
    <a href={link} target="_blank">
      {children}
    </a>
  );
};

enum SortKey {
  SEVEN_D = "SEVEN_D",
  THIRTY_D = "THIRTY_D",
  SIX_M = "SIX_M",
  ONE_Y = "ONE_Y",
  TWO_Y = "TWO_Y",
  THREE_Y = "THREE_Y",
  FOUR_Y = "FOUR_Y",
}

export const sortFundBy = (data: FundPeriodSummary[], sortyKey: SortKey) => {
  data.sort((fundA, fundB) => {
    switch (sortyKey) {
      case SortKey.THIRTY_D:
        return (
          fundB.yesterday_high_value / fundB.thirty_days_low_value -
          fundA.yesterday_high_value / fundA.thirty_days_low_value
        );
      case SortKey.SEVEN_D:
        return (
          fundB.yesterday_high_value / fundB.seven_days_low_value -
          fundA.yesterday_high_value / fundA.seven_days_low_value
        );
      case SortKey.SIX_M:
        return (
          fundB.yesterday_high_value / fundB.six_month_low_value -
          fundA.yesterday_high_value / fundA.six_month_low_value
        );
      case SortKey.ONE_Y:
        return (
          fundB.yesterday_high_value / fundB.one_year_low_value -
          fundA.yesterday_high_value / fundA.one_year_low_value
        );
      case SortKey.TWO_Y:
        return (
          fundB.yesterday_high_value / fundB.two_year_low_value -
          fundA.yesterday_high_value / fundA.two_year_low_value
        );
      case SortKey.THREE_Y:
        return (
          fundB.yesterday_high_value / fundB.three_year_low_value -
          fundA.yesterday_high_value / fundA.three_year_low_value
        );
      case SortKey.FOUR_Y:
        return (
          fundB.yesterday_high_value / fundB.four_year_low_value -
          fundA.yesterday_high_value / fundA.four_year_low_value
        );
    }
  });
  return data;
};

export const RankedFunds = () => {
  const [showChart, setShowChart] = useState<string | number | null>(null);

  const rankingData = useQuery<FundPeriodSummary[]>(["ranking"], async () => {
    const response = await fetch(`${nextConfig.basePath}/api/funds/ranking`);
    return await response.json();
  });
  const [sortKey, setSortKey] = useState(SortKey.THIRTY_D);
  const rankedData: FundPeriodSummary[] = useMemo(
    () => (rankingData.isSuccess ? sortFundBy(rankingData.data, sortKey) : []),
    [rankingData, sortKey]
  );
  const wPerCol = [
    "w-10", // #
    "flex-1 min-w-32", // Nom
    "w-14", // Greenfin
    "w-16", // GreenGot Planet
    "w-16", // GOODVIE (Goodvest)
    "w-16", // 30j
    "w-16", // 6 mois
    "w-16", // 1 an
    "w-16", // 2 ans
    "w-16", // 3 ans
    "w-16", // 4 ans
    "w-32", // Banque(s) disp.
  ];

  useEffect(() => {
    const handleClick = () => {
      setShowChart(null);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto md:overflow-x-hidden">
      <div className="min-w-[920px]">
        <div className="flex flex-row gap-3 my-4 pb-4 text-sm text-gray-700 dark:text-gray-300 border-b-1 border-b-gray-400 dark:border-b-gray-700">
          <div className={wPerCol[0]}>#</div>
          <div className={wPerCol[1]}>Nom</div>
          <div className={`${wPerCol[2]} text-center`}>
            <span className="underline">
              <a
                href="https://www.ecologie.gouv.fr/label-greenfin"
                target="_blank"
              >
                Greenfin
              </a>
            </span>
          </div>
          <div className={`${wPerCol[3]} text-center`}>
            <span className="underline">
              <a
                href="https://green-got.com/articles/selection-assurance-vie"
                target="_blank"
              >
                GreenGot
              </a>
            </span>
          </div>
          <div className={`${wPerCol[4]} text-center`}>
            <span className="underline">
              <a
                href="https://www.goodvest.fr/informations-durabilite"
                target="_blank"
              >
                Goodvest
              </a>
            </span>
          </div>
          <div
            className={wPerCol[5]}
            onClick={() => setSortKey(SortKey.THIRTY_D)}
          >
            30j{sortKey === SortKey.THIRTY_D ? " ▲" : ""}
          </div>
          <div className={wPerCol[6]} onClick={() => setSortKey(SortKey.SIX_M)}>
            6 mois{sortKey === SortKey.SIX_M ? " ▲" : ""}
          </div>
          <div className={wPerCol[7]} onClick={() => setSortKey(SortKey.ONE_Y)}>
            1 an{sortKey === SortKey.ONE_Y ? " ▲" : ""}
          </div>
          <div className={wPerCol[8]} onClick={() => setSortKey(SortKey.TWO_Y)}>
            2 ans{sortKey === SortKey.TWO_Y ? " ▲" : ""}
          </div>
          <div
            className={wPerCol[9]}
            onClick={() => setSortKey(SortKey.THREE_Y)}
          >
            3 ans{sortKey === SortKey.THREE_Y ? " ▲" : ""}
          </div>
          <div
            className={wPerCol[10]}
            onClick={() => setSortKey(SortKey.FOUR_Y)}
          >
            4 ans{sortKey === SortKey.FOUR_Y ? " ▲" : ""}
          </div>
          <div className={wPerCol[11]}>Banque(s) disp.</div>
        </div>
        {rankingData.isLoading && <div className="mt-4">{`Chargement...`}</div>}
        {rankedData.map((summary, idx) => {
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
          const threeYearsDelta = deltaBetweenInPercent({
            from: summary.three_year_low_value,
            to: summary.yesterday_high_value,
          });
          const fourYearsDelta = deltaBetweenInPercent({
            from: summary.four_year_low_value,
            to: summary.yesterday_high_value,
          });

          const yesterdayToLabel = `${roundValues(
            summary.yesterday_high_value
          )} (${dayjs(summary.yesterday_date).format("D/M/YY")})`;

          const oneMonthDeltaLabel = `${roundValues(
            summary.thirty_days_low_value
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
          const threeYearDeltaLabel = `${roundValues(
            summary.three_year_low_value
          )} (${dayjs(summary.three_year_date).format(
            "D/M/YY"
          )}) -> ${yesterdayToLabel})`;
          const fourYearDeltaLabel = `${roundValues(
            summary.four_year_low_value
          )} (${dayjs(summary.four_year_date).format(
            "D/M/YY"
          )}) -> ${yesterdayToLabel})`;

          return (
            <div className="my-4" key={summary.name}>
              <div
                className="flex flex-row flex-nowrap flex-shrink-0 gap-3 text-sm opacity-80 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={wPerCol[0]}>{idx + 1}</div>
                <div className={`${wPerCol[1]} truncate`}>
                  <Tooltip
                    content={summary.name}
                    offset={0}
                    placement="right"
                    delay={10}
                    closeDelay={10}
                    showArrow={true}
                  >
                    <div className="text-ellipsis overflow-hidden">
                      {summary.name}
                    </div>
                  </Tooltip>
                  <FundLink source={summary.source} fundId={summary.id}>
                    <small
                      className="text-gray-800 dark:text-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {summary.source} - {summary.id}
                    </small>
                  </FundLink>
                  {showChart !== summary.id && (
                    <div
                      className="text-xs text-gray-500 mt-1 cursor-pointer"
                      onClick={() => setShowChart(summary.id)}
                    >
                      Voir l'historique
                    </div>
                  )}
                </div>
                <div
                  className={`${wPerCol[2]} flex items-center justify-center`}
                >
                  {summary.is_greenfin ? "🌱" : "❌"}
                </div>
                <div
                  className={`${wPerCol[3]} flex items-center justify-center`}
                >
                  {summary.is_ggplanet ? (
                    <Tooltip
                      content={
                        "Proposé sur l'assurance-vie Green-Got (MAJ: 2025-06-03 / Art. de 2023)"
                      }
                      offset={0}
                      placement="right"
                      delay={10}
                      closeDelay={10}
                      showArrow={true}
                    >
                      🦊
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`${wPerCol[4]} flex items-center justify-center`}
                >
                  {summary.is_goodvie ? (
                    <Tooltip
                      content={
                        "Proposé sur l'assurance-vie Goodvie (Goodvest) (MAJ: 2025-06-03)"
                      }
                      offset={0}
                      placement="right"
                      delay={10}
                      closeDelay={10}
                      showArrow={true}
                    >
                      <Image
                        src={`/assets/goodvest.png`}
                        alt="Goodvie"
                        width={14}
                        height={14}
                        className="rounded"
                      />
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </div>
                <div className={`${wPerCol[5]} flex flex-row items-center`}>
                  {oneMonthDelta !== null && (
                    <RankingMetric
                      metric={oneMonthDelta}
                      deltaLabel={oneMonthDeltaLabel}
                    />
                  )}
                </div>
                <div
                  className={`${wPerCol[6]} flex flex-row gap-2 items-center`}
                >
                  {sixMonthDelta !== null && (
                    <RankingMetric
                      metric={sixMonthDelta}
                      deltaLabel={sixMonthDeltaLabel}
                    />
                  )}
                </div>
                <div
                  className={`${wPerCol[7]} flex flex-row gap-2 items-center`}
                >
                  {oneYearDelta !== null && (
                    <RankingMetric
                      metric={oneYearDelta}
                      deltaLabel={oneYearDeltaLabel}
                    />
                  )}
                </div>
                <div
                  className={`${wPerCol[8]} flex flex-row gap-2 items-center`}
                >
                  {twoYearsDelta !== null && (
                    <RankingMetric
                      metric={twoYearsDelta}
                      deltaLabel={twoYearDeltaLabel}
                    />
                  )}
                </div>
                <div
                  className={`${wPerCol[9]} flex flex-row gap-2 items-center`}
                >
                  {threeYearsDelta !== null && (
                    <RankingMetric
                      metric={threeYearsDelta}
                      deltaLabel={threeYearDeltaLabel}
                    />
                  )}
                </div>
                <div
                  className={`${wPerCol[10]} flex flex-row gap-2 items-center`}
                >
                  {fourYearsDelta !== null && (
                    <RankingMetric
                      metric={fourYearsDelta}
                      deltaLabel={fourYearDeltaLabel}
                    />
                  )}
                </div>
                <div
                  className={`${wPerCol[11]} flex flex-row gap-2 items-center truncate`}
                >
                  <Tooltip
                    content={summary.available_banks.join(",")}
                    offset={0}
                    placement="right"
                    delay={10}
                    closeDelay={10}
                    showArrow={true}
                  >
                    <div className="text-ellipsis overflow-hidden">
                      {summary.available_banks.join(",")}
                    </div>
                  </Tooltip>
                </div>
              </div>
              {showChart !== null && showChart === summary.id && (
                <div className="h-40">
                  <FundChart
                    id={summary.id}
                    startDate={dayjs().subtract(4, "y")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
