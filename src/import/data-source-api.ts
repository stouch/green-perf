import yahooFinance from "yahoo-finance2";
import dayjs from "dayjs";
import { AssetHistoryDay } from "./types";
import axios from "axios";

export const importYahooHistory = async (
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

export const importBoursoramaHistory = async (
  tickerId: string,
  periodStart: string
): Promise<AssetHistoryDay[]> => {
  let daysNb = dayjs().diff(periodStart, "day");
  if (daysNb > 365) {
    if (daysNb <= 730) {
      daysNb = 730;
    } else if (daysNb <= 1095) {
      daysNb = 1095;
    } // TODO: find more data?
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
    return [];
  }
  const parsedGraph: { dataProvider: { x: string; y_0: number }[] } =
    JSON.parse(results.graph);
  if (!parsedGraph) {
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
