export type AssetHistoryDay = {
  date: string;
  openValue: number;
  highValue: number;
  lowValue: number;
  closeValue: number;
};

export type AssetHistory = {
  id: string;
  name: string;
  history: AssetHistoryDay[];
};

export type AssetImportSource = "yahoo" | "boursorama" | "quantalys"; // | "custom" ?
