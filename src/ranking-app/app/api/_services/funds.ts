import { chClient } from "./db-client";
import { FundDayData } from "../../../types/shared/fund";

export const getFundHistory = async (
  fundId: string
): Promise<FundDayData[]> => {
  const fundDataQuery = await chClient().query({
    query: "SELECT * FROM fund_histo_data WHERE fund_id = {fundId: String};",
    format: "JSON",
    query_params: {
      fundId,
    },
  });
  const rows: { data: FundDayData[] } = await fundDataQuery.json();
  return rows.data;
};
