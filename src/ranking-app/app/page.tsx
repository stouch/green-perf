"use client";

import { FundChart } from "./_components/FundChart";
import { RankedFunds } from "./_components/RankedFunds";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-3/4">
        <div className="m-2">
          Ranking
          <RankedFunds />
        </div>
        <div className="mt-6">
          <FundChart id={"0P00016Q7A.F"} />
        </div>
      </div>
    </main>
  );
}
