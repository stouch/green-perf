"use client";

import { HomeQueriedChart } from "./_components/HomeQueriedChart";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-3/4">
        <HomeQueriedChart id={"0P00016Q7A.F"} />
      </div>
    </main>
  );
}
