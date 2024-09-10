import yahooFinance from "yahoo-finance2";
import dayjs from "dayjs";
import { AssetHistoryDay } from "./types";
import axios from "axios";

import { ChartResultArray } from "yahoo-finance2/dist/esm/src/modules/chart";
import { HistoricalHistoryResult } from "yahoo-finance2/dist/esm/src/modules/historical";

const convertToHistoricalResult = (
  result: ChartResultArray
): HistoricalHistoryResult => {
  const quotes = result.quotes
    .map((quote) => ({
      ...quote,
      open: quote.open || null,
      high: quote.high || null,
      low: quote.low || null,
      close: quote.close || null,
      volume: quote.volume || null,
    }))
    .filter(
      (dailyQuote) => dailyQuote.low !== null || dailyQuote.high !== null
    );
  return quotes;
};

export const importYahooHistory = async (
  tickerId: string,
  periodStart: string
): Promise<AssetHistoryDay[]> => {
  const results = convertToHistoricalResult(
    await yahooFinance.chart(tickerId, {
      period1: periodStart,
    })
  );

  if (!results || results.length === 0) {
    console.log("No yahoo data !");
    return [];
  }
  return results.map((r) => ({
    date: dayjs(r.date).format("YYYY-MM-DD"),
    openValue: r.open,
    highValue: r.high,
    lowValue: r.low,
    closeValue: r.close,
  }));
};

export const importBoursoramaHistory = async (
  tickerId: string,
  periodStart: string
): Promise<AssetHistoryDay[]> => {
  let daysNb = dayjs().diff(periodStart, "day");
  if (daysNb > 365) {
    if (daysNb <= 730) {
      // on est entre 1 et 2 ans:
      daysNb = 730;
    } else if (daysNb <= 1095) {
      // on est entre 2 et 3 ans:
      daysNb = 1095;
    } else {
      daysNb = 1825; // TODO: find more data?
    }
  }
  const results = (
    await axios.get<{
      d: {
        Name: string;
        QuoteTab: {
          c: number; // close
          d: number; // day number, starting from 1970
          h: number; // high
          l: number; // low
          o: number; // opening
          v: number; // volume
        }[];
        SymbolId: string;
      };
    }>(
      `https://www.boursorama.com/bourse/action/graph/ws/GetTicksEOD?symbol=${tickerId}&length=${daysNb}&period=0&guid=`
    )
  ).data;
  if (!results.d) {
    console.log("No boursorama data !");
    return [];
  }
  if (!results.d.QuoteTab) {
    console.log("No boursorama data !");
    return [];
  }
  return results.d.QuoteTab.map((r, dayIdx) => {
    const date = dayjs("1970-01-01").add(r.d, "day").format("YYYY-MM-DD");
    return {
      date,
      openValue: r.o,
      highValue: r.h,
      lowValue: r.l,
      closeValue: r.c,
    };
  });
};

export const importQuantalysHistory = async (
  tickerId: string,
  periodStart: string
): Promise<AssetHistoryDay[]> => {
  const daysNb = dayjs().diff(periodStart, "day");
  const results = (
    await axios.post<{
      graph: string;
    }>(
      `https://www.quantalys.com/Fonds/GetChartHisto_Historique?currency=EUR`,
      {
        ID_Produit: tickerId,
        jsonListeCourbes: JSON.stringify([
          {
            ID: tickerId,
            Nom: "Fund",
            Type: 1,
            Color: "#0A50A1",
            FinancialItem: {
              ID_Produit: tickerId,
              cTypeFinancialItem: 1,
              cClasseFinancialItem: 0,
              nModeCalcul: 0,
            },
          },
        ]),
        sDtStart: dayjs(periodStart).format("DD-MM-YYYY"),
        sDtEnd: dayjs().format("DD-MM-YYYY"),
      }
    )
  ).data;
  if (!results.graph) {
    console.log("No quantalys data !");
    return [];
  }
  const parsedGraph: { dataProvider: { x: string; y_0: number }[] } =
    JSON.parse(results.graph);
  if (!parsedGraph) {
    console.log("No quantalys data !");
    return [];
  }
  return parsedGraph.dataProvider.map((r, dayIdx) => ({
    date: r.x,
    openValue: r.y_0,
    highValue: r.y_0,
    lowValue: r.y_0,
    closeValue: r.y_0,
  }));
};
