"use client";

import { FundChart } from "./_components/FundChart";
import { RankedFunds } from "./_components/RankedFunds";

export default function Home() {
  return (
    <main className="min-h-screen py-24 px-4 md:px-24 overflow-x-auto md:overflow-x-hidden">
      <div className="w-[800px] mx-auto">
        <div className="text-gray-300">
          {`Cessons d'investir dans les combustibles fossiles. Déplaçons nos épargnes.`}
        </div>
        <div className="mt-4 text-gray-500">
          {`Tous les fonds "verts" listés sont accessibles par souscription
            via les banques et assurances-banques institutionnelles. 
          Parlez-en à votre conseiller en patrimoine ou à votre banquier.`}
        </div>
        <div className="mt-12">
          <RankedFunds />
        </div>
        {/*<div className="mt-6">
          <FundChart id={"0P00016Q7A.F"} />
  </div>*/}
      </div>
    </main>
  );
}
