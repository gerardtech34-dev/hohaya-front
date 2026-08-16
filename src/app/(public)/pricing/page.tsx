import { Check } from "lucide-react";
import * as abonnementsApi from "@/lib/api/abonnements";
import { formatPrix } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = { title: "Tarifs" };

const INCLUS = [
  "Publication illimitée d'annonces",
  "Photos et vidéos haute qualité",
  "Mise en relation directe avec les étudiants",
  "Support prioritaire",
];

export default async function TarifsPage() {
  const tarifs = await abonnementsApi.tarifs().catch(() => []);
  const populaire = "trimestriel";

  return (
    <div className="pb-16">
      {/* Hero — bandeau plein terracotta, cartes en chevauchement */}
      <section className="bg-primary px-4 pb-24 pt-16 text-primary-foreground sm:pt-20">
        <div className="mx-auto max-w-[1440px] text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">Tarifs propriétaires</h1>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Souscrivez à un abonnement pour publier vos annonces sur Hohaya. Sans engagement,
            résiliable à tout moment.
          </p>
        </div>
      </section>

      <div className="px-4">
        <div className="mx-auto -mt-14 max-w-[1440px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tarifs.map((t) => {
              const isPopular = t.type === populaire;
              return (
                <div
                  key={t.type}
                  className={cn(
                    "relative flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-md",
                    isPopular ? "border-primary ring-2 ring-primary" : "border-border"
                  )}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Le plus populaire</Badge>
                  )}
                  <h2 className="font-heading text-lg font-semibold">{t.label}</h2>
                  <p className="font-heading text-3xl font-bold text-primary">
                    {formatPrix(t.montant, t.devise)}
                  </p>
                  {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
                  <ul className="space-y-2 text-sm">
                    {INCLUS.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check size={16} className="mt-0.5 shrink-0 text-secondary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href="/register"
                    className="mt-auto w-full"
                    variant={isPopular ? "default" : "outline"}
                  >
                    Commencer
                  </ButtonLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
