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
  // Ranked period summaries
  const periodSummariesQuery = await chClient().query({
    query: `
      SELECT 
        fund.name as name,
        MIN(fund_histo_data.low_value) as period_low_value, 
        MAX(fund_histo_data.high_value) as period_high_value,

        yesterday.high_value as yesterday_high_value,
        yesterday.date as yesterday_date,
        sevenDaysAgo.low_value as seven_days_low_value,
        sevenDaysAgo.date as seven_days_date,
        thirtyDaysAgo.low_value as thirty_days_low_value,
        thirtyDaysAgo.date as thirty_days_date,
        sixMonthAgo.low_value as six_month_low_value,
        sixMonthAgo.date as six_month_date

      FROM fund_histo_data 
        INNER JOIN fund ON fund.id = fund_histo_data.fund_id

        LEFT JOIN (
          SELECT MAX(date) as max_date, fund_id FROM fund_histo_data 
            WHERE date <= {yesterday: Date} GROUP BY fund_id
        ) yesterdayDate ON fund.id = yesterdayDate.fund_id
        LEFT JOIN fund_histo_data yesterday ON 
          yesterday.date = yesterdayDate.max_date AND yesterday.fund_id = fund.id

        LEFT JOIN (
          SELECT MAX(date) as max_date, fund_id FROM fund_histo_data 
            WHERE date <= {sevenDaysAgo: Date} GROUP BY fund_id
        ) sevenDaysAgoDate ON fund.id = sevenDaysAgoDate.fund_id
        LEFT JOIN fund_histo_data sevenDaysAgo ON 
          sevenDaysAgo.date = sevenDaysAgoDate.max_date AND sevenDaysAgo.fund_id = fund.id

        LEFT JOIN (
          SELECT MAX(date) as max_date, fund_id FROM fund_histo_data 
            WHERE date <= {thirtyDaysAgo: Date} GROUP BY fund_id
        ) thirtyDaysAgoDate ON fund.id = thirtyDaysAgoDate.fund_id
        LEFT JOIN fund_histo_data thirtyDaysAgo ON 
          thirtyDaysAgo.date = thirtyDaysAgoDate.max_date AND thirtyDaysAgo.fund_id = fund.id

        LEFT JOIN (
          SELECT MAX(date) as max_date, fund_id FROM fund_histo_data 
            WHERE date <= {sixMonthAgo: Date} GROUP BY fund_id
        ) sixMonthAgoDate ON fund.id = sixMonthAgoDate.fund_id
        LEFT JOIN fund_histo_data sixMonthAgo ON 
          sixMonthAgo.date = sixMonthAgoDate.max_date AND sixMonthAgo.fund_id = fund.id

      WHERE fund_histo_data.date >= {from: Date} AND fund_histo_data.date <= {to: Date}
      GROUP BY 
        fund.name, 
        sixMonthAgo.low_value, 
        sixMonthAgo.date,
        thirtyDaysAgo.low_value, 
        thirtyDaysAgo.date,
        sevenDaysAgo.low_value, 
        sevenDaysAgo.date,
        yesterday.high_value,
        yesterday.date
      ORDER BY ((yesterday.high_value)/thirtyDaysAgo.low_value) DESC;`, // rank based on delta on 30 days
    format: "JSON",
    query_params: {
      from: periodStart.format("YYYY-MM-DD"),
      to: periodEnd.format("YYYY-MM-DD"),
      sevenDaysAgo: dayjs().subtract(7, "d").format("YYYY-MM-DD"),
      thirtyDaysAgo: dayjs().subtract(30, "d").format("YYYY-MM-DD"),
      sixMonthAgo: dayjs().subtract(6, "month").format("YYYY-MM-DD"),
      yesterday: dayjs().subtract(1, "d").format("YYYY-MM-DD"),
    },
  });
  // We gonna fetch raw data, without position information which is just issued from the ORDER BY
  const rows = await periodSummariesQuery.json<{
    data: Omit<FundPeriodSummary, "position">[];
  }>();

  return rows.data.map((row, rowIdx) => ({
    ...row,
    position: rowIdx + 1,
  }));
};
