import yahooFinance from "yahoo-finance2";
import dayjs from "dayjs";
import { Asset, AssetHistoryDay, AssetScrapeSource } from "./types";
import { chClient } from "./db-client";

const yahooHistoryScrape = async (
  tickerId: string,
  periodStart: string
): Promise<AssetHistoryDay[]> => {
  const results = await yahooFinance.historical(tickerId, {
    period1: periodStart,
  });
  return results.map((r) => ({
    date: dayjs(r.date).format("YYYY-MM-DD"),
    openValue: r.open,
    highValue: r.high,
    lowValue: r.low,
    closeValue: r.close,
  }));
};

const fundScrape = async (
  source: AssetScrapeSource,
  periodStart: string,
  tickerId: string,
  name: string,
  metaUrl: string
): Promise<Asset> => {
  const historyData =
    source === "yahoo" ? await yahooHistoryScrape(tickerId, periodStart) : []; // May have other sources
  return {
    id: tickerId,
    url: metaUrl,
    name,
    history: historyData,
  };
};

const initialScrape = async (from: string) => {
  console.log(`Initial import from ${from}...`);

  // DROP TABLES:
  await chClient().command({
    query: `
      DROP TABLE IF EXISTS fund
    `,
  });
  await chClient().command({
    query: `
      DROP TABLE IF EXISTS fund_histo_data
    `,
  });

  // Create tables
  await chClient().command({
    query: `
      CREATE TABLE IF NOT EXISTS fund
      (
        id String,
        name String
      )
      ENGINE MergeTree()
      ORDER BY (id)
    `,
  });
  await chClient().command({
    query: `
      CREATE TABLE IF NOT EXISTS fund_histo_data
      (
        fund_id String,
        date Date,
        open_value Float64,
        high_value Float64,
        low_value Float64,
        close_value Float64
      )
      ENGINE MergeTree()
      ORDER BY (fund_id, date)
    `,
  });

  // Based on our listing ..
  const funds: Array<
    [AssetScrapeSource, string, string, string]
  > = require("./funds.json");

  // .. we fetch initial data:
  const assets: Array<Promise<Asset>> = funds.map(async (fund) => {
    console.log(`Import asset ${fund[0]}/${fund[2]}...`);
    return await fundScrape(fund[0], from, fund[1], fund[2], fund[3]);
  });

  // Insert initial data

  // TODO: insert conditionnally ONLY if date data isnt in table.

  await chClient().insert({
    table: "fund",
    values: [
      ...funds.map((asset) => ({
        id: asset[1],
        name: asset[2],
      })),
    ],
    format: "JSONEachRow",
  });
  await chClient().insert({
    table: "fund_histo_data",
    values: [
      ...(
        await Promise.all(assets)
      )
        .map((asset) =>
          asset.history.map((dayData) => ({
            fund_id: asset.id,
            date: dayData.date,
            open_value: dayData.openValue,
            high_value: dayData.highValue,
            low_value: dayData.lowValue,
            close_value: dayData.closeValue,
          }))
        )
        .flat(),
    ],
    format: "JSONEachRow",
  });
};

// Run the initial import
initialScrape("2023-06-01");
