import { NextResponse } from "next/server";
import { getFundHistory } from "../../../_services/funds";
import { FundDayData } from "../../../../../types/shared/fund";

export async function GET(
  request: Request,
  { params }: { params: { fundId: string } }
) {
  const daysTimeSerie: FundDayData[] = await getFundHistory(params.fundId);
  return NextResponse.json(daysTimeSerie);
}
