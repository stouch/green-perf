export type FundDayData = {
  date: string;
  open_value: number;
  high_value: number;
  low_value: number;
  close_value: number;
  volume?: number;
};

export type FundData = {
  name: string;
  histo: FundDayData[];
};

export type FundSource = "yahoo" | "boursorama" | "quantalys";

export type FundPeriodSummary = {
  position: number;
  id: string;
  name: string; // eg: "LCL Actions Monde Environnement C"
  available_banks: string[]; // eg: ["LCL"]
  source: FundSource; // eg: "yahoo"
  is_greenfin: boolean;
  is_ggplanet: boolean; // GreenGot Planet
  is_goodvie: boolean; // Goodvie (Goodvest)
  period_high_value: number;
  period_low_value: number;
  period_volume?: number;

  // To give a rank using diff between seven-days ago (or thirty-days ago) compared to yesterday:
  yesterday_high_value: number;
  yesterday_date: Date; // yesterday last histo date may not be yesterday but 2 days ago
  seven_days_low_value: number;
  seven_days_date: Date;
  thirty_days_low_value: number;
  thirty_days_date: Date;
  six_month_low_value: number;
  six_month_date: Date;
  one_year_low_value: number;
  one_year_date: Date | null;
  two_year_low_value: number;
  two_year_date: Date | null;
  three_year_low_value: number;
  three_year_date: Date | null;
  four_year_low_value: number;
  four_year_date: Date | null;
};
