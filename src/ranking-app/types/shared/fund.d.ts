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

export type FundPeriodSummary = {
  name: string;
  period_high_value: number;
  period_low_value: number;
  period_volume?: number;
};
