import { NextResponse } from "next/server";
import { getFund } from "../../_services/funds";
import { FundData } from "../../../../types/shared/fund";

// Always run at request-time (needs ClickHouse). Prevent Next from trying to prerender at build time.
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { fundId: string } }
) {
  const fundDate: FundData = await getFund(params.fundId);
  return NextResponse.json(fundDate);
}
