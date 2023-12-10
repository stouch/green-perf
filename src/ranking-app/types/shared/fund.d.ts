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
  position: number;
  name: string;
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
};
