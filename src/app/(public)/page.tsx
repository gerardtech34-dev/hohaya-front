import Link from "next/link";
import {
  ShieldCheck,
  Wallet,
  GraduationCap,
  Search,
  KeyRound,
  Handshake,
  CreditCard,
  Megaphone,
  MessageCircle,
  Home,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HeroVisual } from "@/components/home/HeroVisual";
import * as propertiesApi from "@/lib/api/properties";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Maisons vérifiées", detail: "Zéro arnaque, zéro mauvaise surprise" },
  { icon: Wallet, label: "Paiement sécurisé", detail: "500 FCFA pour débloquer un contact, via Mobile Money" },
  { icon: GraduationCap, label: "Pensé pour les étudiants", detail: "Des logements adaptés à votre budget d'étudiant" },
];

const STEPS_SEEKER = [
  { icon: Search, title: "Cherchez une maison", text: "Filtrez par ville, quartier et budget pour trouver une maison près de votre école." },
  { icon: KeyRound, title: "Débloquez le contact", text: "Payez une petite somme (dès 500 FCFA) pour accéder directement au contact du propriétaire." },
  { icon: Handshake, title: "Visitez et emménagez", text: "Convenez d'une visite avec le propriétaire et installez-vous avant la rentrée." },
];

const STEPS_OWNER = [
  { icon: CreditCard, title: "Souscrivez", text: "Un abonnement annuel à prix accessible, pensé pour toucher un maximum d'étudiants." },
  { icon: Megaphone, title: "Publiez votre maison", text: "Ajoutez photos, caractéristiques et indications d'accès en quelques minutes." },
  { icon: MessageCircle, title: "Recevez des demandes", text: "Des étudiants sérieux vous contactent directement pour visiter." },
];

export default async function HomePage() {
  const result = await propertiesApi.list({ page: 1 }).catch(() => null);
  const properties = result?.data.slice(0, 6) ?? [];

  return (
    <div>
      {/* Bandeau rentrée */}
      <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
        🎓 Prépare ta rentrée : trouve ta maison dès maintenant
      </div>

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-muted/60 to-background px-4 pb-14 pt-10 sm:pt-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              La plateforme logement des étudiants au Bénin
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
              Trouve ta maison pour la rentrée,{" "}
              <span className="text-primary">en toute confiance</span>
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Hohaya aide les étudiants à trouver une maison à louer près de chez eux, avec des
              annonces vérifiées et un paiement sécurisé — sans passer par un démarcheur.
            </p>
            <HeroSearch />
          </div>
          <HeroVisual />
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t border-border bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Comment ça marche</h2>
            <p className="mt-2 text-muted-foreground">
              Deux parcours simples : que tu cherches une maison ou que tu en aies une à louer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold text-primary">Tu es étudiant</h3>
              <ol className="space-y-4">
                {STEPS_SEEKER.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold text-secondary">Tu es propriétaire</h3>
              <ol className="space-y-4">
                {STEPS_OWNER.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Maisons à la une */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">Maisons à la une</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Home size={14} /> Sélection de maisons vérifiées, disponibles dès maintenant
              </p>
            </div>
            <Link href="/annonces" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Voir tout
            </Link>
          </div>
          {properties.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Aucune annonce disponible pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA propriétaires */}
      <section className="px-4 pb-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl bg-secondary px-6 py-12 text-center text-secondary-foreground sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Une maison à louer près d&apos;une école ?</h2>
            <p className="mt-2 text-secondary-foreground/90">
              Publiez votre annonce et touchez des centaines d&apos;étudiants à la recherche d&apos;un
              logement pour la rentrée.
            </p>
          </div>
          <ButtonLink href="/tarifs" size="lg" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary-hover">
            Voir les tarifs
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
