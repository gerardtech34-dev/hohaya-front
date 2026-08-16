"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VILLES: { nom: string; quartiers: string[] }[] = [
  { nom: "Cotonou", quartiers: ["Cadjehoun", "Akpakpa", "Fidjrossè", "Gbégamey", "Sainte Rita", "Zogbo", "Vêdoko", "Agla", "Cocotomey", "Jéricho"] },
  { nom: "Abomey-Calavi", quartiers: ["Godomey", "Womey", "Zogbo", "Togba", "Calavi Centre", "Akassato", "Hévié"] },
  { nom: "Porto-Novo", quartiers: ["Ouando", "Djassin", "Attakè", "Houinmè", "Avankpa"] },
  { nom: "Parakou", quartiers: ["Titirou", "Banikanni", "Zongo", "Albarika", "Sinagourou"] },
  { nom: "Ouidah", quartiers: ["Centre-ville", "Avlékété", "Docodji", "Zebe"] },
  { nom: "Bohicon", quartiers: ["Agongointo", "Avogbanna", "Passagon", "Lissezoun"] },
];

export function BrowseCities() {
  return (
    <section className="border-t border-border px-4 py-14">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="mb-6 font-heading text-2xl font-bold sm:text-3xl">
          Explorez toutes les villes avec des maisons à louer
        </h2>

        <Tabs defaultValue={VILLES[0].nom}>
          <TabsList
            variant="line"
            className="mb-6 h-auto w-full flex-nowrap justify-start gap-x-6 overflow-x-auto p-0 sm:flex-wrap sm:gap-y-2 sm:overflow-visible"
          >
            {VILLES.map((v) => (
              <TabsTrigger
                key={v.nom}
                value={v.nom}
                className="shrink-0 whitespace-nowrap px-0 py-2 text-base font-medium data-active:text-primary"
              >
                {v.nom}
              </TabsTrigger>
            ))}
          </TabsList>

          {VILLES.map((v) => (
            <TabsContent key={v.nom} value={v.nom}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:grid-cols-5">
                <Link
                  href={`/listings?city=${encodeURIComponent(v.nom)}`}
                  className="text-sm font-semibold text-primary transition hover:underline"
                >
                  Toute la ville de {v.nom}
                </Link>
                {v.quartiers.map((q) => (
                  <Link
                    key={q}
                    href={`/listings?city=${encodeURIComponent(v.nom)}&district=${encodeURIComponent(q)}`}
                    className="text-sm text-foreground/80 transition hover:text-primary hover:underline"
                  >
                    {q}
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
