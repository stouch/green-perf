"use client";

import { RankedFunds } from "./_components/RankedFunds";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Mon épargne verte";
  }, []);
  return (
    <main className="min-h-screen py-20 px-4 md:px-24 overflow-x-auto md:overflow-x-hidden">
      <div className="w-[860px] mx-auto">
        <div className="mt-6 text-gray-300">
          {`Mettre son épargne au vert 🌳`}
        </div>
        <div className="mt-2 text-gray-500">
          {`Tous les fonds "verts" listés ci-dessous sont des OPCVM, 
            accessibles à n'importe quel particulier 
            par souscription à des unités de compte sur une assurance-vie par exemple. 
            Les valeurs sont actualisées une fois par jour.`}
        </div>
        <div className="mt-2 text-gray-500">
          {`Parlez-en à votre conseiller en patrimoine ou à votre banquier.`}
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
