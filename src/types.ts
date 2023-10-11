export type AssetHistoryDay = {
  date: string;
  openValue: number;
  highValue: number;
  lowValue: number;
  closeValue: number;
};

export type Asset = {
  id: string;
  url: string;
  name: string;
  history: AssetHistoryDay[];
};

export type AssetScrapeSource = "yahoo"; // | "custom" ?
