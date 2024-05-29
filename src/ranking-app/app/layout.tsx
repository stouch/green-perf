"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";

const queryClient = new QueryClient();

const inter = Inter({ subsets: ["latin"] });

const setIsDarkInStorage = (isDarkTheme: boolean) => {
  window.localStorage.setItem("darkMode", isDarkTheme ? "1" : "0");
};
const getIsDarkInStorage = () => {
  return typeof window !== "undefined" &&
    window.localStorage.getItem("darkMode") !== null
    ? window.localStorage.getItem("darkMode") === "1"
    : true; // default is true.
};

const DangerBanner = () => {
  return (
    <div className="block text-center w-full p-2 bg-red-500 text-white z-10">
      ⚠️{" "}
      {`Attention, les informations figurant sur cette page ne constituent en aucun cas un conseil de placement ou d'ordre juridique, fiscal ou autre`}
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkmode, setDarkmode] = useState<boolean>();
  useEffect(() => {
    setDarkmode(getIsDarkInStorage());
  }, []);
  const toggleDarkmode = useCallback((newValue: boolean) => {
    setDarkmode(newValue);
    setIsDarkInStorage(newValue);
  }, []);
  return (
    <html lang="en">
      <body className={`${darkmode ? "dark " : ""}${inter.className}`}>
        <NextUIProvider>
          <QueryClientProvider client={queryClient}>
            <DangerBanner />
            <div className="relative min-h-screen px-4 md:px-24 pt-8">
              <div className="w-full md:w-[920px] mx-auto relative text-black dark:text-white">
                <div className="float-right pl-4 pt-1">
                  <a
                    className="underline text-black dark:text-white cursor-pointer"
                    onClick={() => toggleDarkmode(!darkmode)}
                  >
                    {`Mode ${darkmode ? "clair" : "sombre"}`}
                  </a>
                </div>
                {children}
              </div>
            </div>
          </QueryClientProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
