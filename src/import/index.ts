import { AssetHistory, AssetImportSource } from "./types";
import { chClient } from "./db-client";
import {
  importBoursoramaHistory,
  importQuantalysHistory,
  importYahooHistory,
} from "./data-source-api";

const fetchFundHistoryData = async (
  source: AssetImportSource,
  periodStart: string,
  tickerId: string,
  name: string
): Promise<AssetHistory> => {
  const historyData =
    source === "yahoo"
      ? await importYahooHistory(tickerId, periodStart)
      : source === "boursorama"
      ? await importBoursoramaHistory(tickerId, periodStart)
      : source === "quantalys"
      ? await importQuantalysHistory(tickerId, periodStart)
      : []; // May have other sources
  return {
    id: tickerId,
    name,
    history: historyData,
  };
};

const initialImport = async (from: string) => {
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
    // TODO: would like to use experimental JSON feature of clickhouse <3
    query: `
      CREATE TABLE IF NOT EXISTS fund
      (
        id String,
        name String,
        source String,
        specs String 
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
    [
      AssetImportSource, // [0]
      string, // fund ticker id [1]
      string, // fund name [2]
      Record<string, string | string[]> // fund specs [3]
    ]
  > = require("./funds.json");

  // .. we fetch initial data:
  const assets: Array<AssetHistory> = [];
  for (const fund of funds) {
    console.log(`Import asset ${fund[0]}/${fund[2]}...`);
    assets.push(await fetchFundHistoryData(fund[0], from, fund[1], fund[2]));
  }

  // Insert initial data

  // TODO: insert conditionnally ONLY if date data isnt in table.

  await chClient().insert({
    table: "fund",
    values: [
      ...funds.map((fund) => ({
        source: fund[0],
        id: fund[1],
        name: fund[2],
        specs: JSON.stringify(fund[3]),
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
initialImport(process.env.FROM || "2021-05-01");
