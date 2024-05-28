"use client";

import { RankedFunds } from "./_components/RankedFunds";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Mon épargne verte";
  }, []);
  return (
    <main className="min-h-screen pt-20 pb-20 px-4 md:px-24 overflow-x-auto md:overflow-x-hidden">
      <div className="fixed block left-0 top-0 text-center w-full p-2 bg-red-500 text-white">
        ⚠️{" "}
        {`Attention, les informations figurant sur cette page ne constituent en aucun cas un conseil de placement ou d'ordre juridique, fiscal ou autre`}
      </div>
      <div className="w-[920px] mx-auto">
        <div className="text-xl text-gray-300">
          {`Mettre son épargne au vert 🌳`}
        </div>
        <div className="mt-6 text-gray-400">
          {`Tous les fonds "verts" listés ci-dessous sont pour la plupart des OPCVM, 
            accessibles aux particuliers par souscription sur une assurance-vie par exemple. 
            Les valeurs sont actualisées une fois par jour.`}
        </div>
        <div className="mt-2 text-gray-400">
          {`Parlez-en à votre conseiller en patrimoine ou à votre banquier.`}
        </div>
        <div className="mt-2 text-gray-400">
          {`Page officielle du label Greenfin (nouvel onglet): `}{" "}
          <a
            href="https://www.ecologie.gouv.fr/label-greenfin"
            target="_blank"
            className="underline text-white"
          >
            https://www.ecologie.gouv.fr/label-greenfin
          </a>
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
