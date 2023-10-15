import { chClient } from "./db-client";
import {
  FundData,
  FundDayData,
  FundPeriodSummary,
} from "../../../types/shared/fund";
import dayjs from "dayjs";

export const getFund = async (fundId: string): Promise<FundData> => {
  const fundDataQuery = await chClient().query({
    query: `SELECT
        fund.name, 
        fund_histo_data.* 
      FROM fund_histo_data 
        INNER JOIN fund ON fund.id = fund_histo_data.fund_id
      WHERE fund_histo_data.fund_id = {fundId: String};`,
    format: "JSON",
    query_params: {
      fundId,
    },
  });
  const rows: { data: (FundDayData & { name: string })[] } =
    await fundDataQuery.json();
  return {
    name: rows.data[0].name,
    histo: rows.data.map((row) => ({
      ...row,
    })),
  };
};

export const getFundHistory = async (
  fundId: string
): Promise<FundDayData[]> => {
  const fundHistoQuery = await chClient().query({
    query: "SELECT * FROM fund_histo_data WHERE fund_id = {fundId: String};",
    format: "JSON",
    query_params: {
      fundId,
    },
  });
  const rows: { data: FundDayData[] } = await fundHistoQuery.json();
  return rows.data;
};

export const getFundsRanking = async ({
  periodStart,
  periodEnd,
}: {
  periodStart: dayjs.Dayjs;
  periodEnd: dayjs.Dayjs;
}): Promise<FundPeriodSummary[]> => {
  const periodSummariesQuery = await chClient().query({
    query: `
      SELECT 
        fund.name,
        MIN(fund_histo_data.low_value) as period_low_value, 
        MAX(fund_histo_data.high_value) as period_high_value
      FROM fund_histo_data 
        INNER JOIN fund ON fund.id = fund_histo_data.fund_id
      WHERE fund_histo_data.date >= {from: Date} AND fund_histo_data.date <= {to: Date}
      GROUP BY fund.name;`,
    format: "JSON",
    query_params: {
      from: periodStart.format("YYYY-MM-DD"),
      to: periodEnd.format("YYYY-MM-DD"),
    },
  });
  const rows: { data: FundPeriodSummary[] } = await periodSummariesQuery.json();
  return rows.data;
};
