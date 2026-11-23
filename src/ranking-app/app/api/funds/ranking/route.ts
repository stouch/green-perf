import { NextResponse } from "next/server";
import { getFundsRanking } from "../../_services/funds";
import { FundPeriodSummary } from "../../../../types/shared/fund";
import dayjs from "dayjs";

// Always run at request-time (needs ClickHouse). Prevent Next from trying to prerender at build time.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const from = dayjs("2023-10-01");
  const to = dayjs();
  const summaries: FundPeriodSummary[] = await getFundsRanking({
    periodStart: from,
    periodEnd: to,
  });
  return NextResponse.json(summaries);
}
