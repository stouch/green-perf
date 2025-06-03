"use client";

import { RankedFunds } from "./_components/RankedFunds";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Mon épargne verte";
  }, []);
  return (
    <main className="pb-12">
      <div className="text-xl text-gray-900 dark:text-gray-300">
        {`Mettre son épargne au vert 🌳`}
      </div>
      <div className="mt-6 text-gray-700 dark:text-gray-400">
        {`Tous les fonds "verts" listés ci-dessous sont pour la plupart des OPCVM, 
            accessibles aux particuliers par souscription sur une assurance-vie par exemple. 
            Les valeurs sont actualisées une fois par jour.`}
      </div>
      <div className="mt-2 text-gray-700 dark:text-gray-400">
        {`Parlez-en à votre conseiller en patrimoine ou à votre banquier.`}
      </div>
      <div className="mt-2 text-gray-700 dark:text-gray-400">
        {`Page officielle du label Greenfin (nouvel onglet): `}{" "}
        <a
          href="https://www.ecologie.gouv.fr/label-greenfin"
          target="_blank"
          className="underline"
        >
          https://www.ecologie.gouv.fr/label-greenfin
        </a>
      </div>
      <div className="mt-12">
        <RankedFunds />
      </div>
    </main>
  );
}
