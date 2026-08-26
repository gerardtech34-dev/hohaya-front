"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Heart, CalendarCheck, KeyRound, Headset, Search, UserCog, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { mesFavoris, mesVisites } from "@/lib/api/chercheur";
import * as contactsApi from "@/lib/api/contacts";
import * as supportApi from "@/lib/api/support";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { LoadingState } from "@/components/ui/loading-state";

export default function SeekerDashboardPage() {
  const { user } = useAuth();
  const favoris = useQuery({ queryKey: ["favoris"], queryFn: mesFavoris });
  const visites = useQuery({ queryKey: ["visites"], queryFn: mesVisites });
  const contacts = useQuery({ queryKey: ["contacts-historique"], queryFn: contactsApi.historique });
  const tickets = useQuery({ queryKey: ["support-tickets"], queryFn: supportApi.listTickets });

  const prochaineVisite = visites.data?.data
    .filter((v) => v.status === "confirmée")
    .sort((a, b) => (a.date_souhaitee ?? "").localeCompare(b.date_souhaitee ?? ""))[0];

  const visitesAVenir =
    visites.data?.data.filter((v) => v.status === "confirmée" || v.status === "en_attente").length ?? 0;
  const ticketsOuverts = tickets.data?.data.filter((t) => t.status !== "fermé").length ?? 0;

  const STATS = [
    { icon: Heart, label: "Favoris", value: favoris.data?.total, href: "/dashboard/favoris" },
    { icon: CalendarCheck, label: "Visites à venir", value: visitesAVenir, href: "/dashboard/visites" },
    { icon: KeyRound, label: "Contacts débloqués", value: contacts.data?.total, href: "/dashboard/contacts" },
    { icon: Headset, label: "Tickets ouverts", value: ticketsOuverts, href: "/dashboard/support" },
  ];

  const derniersFavoris = favoris.data?.data.filter((f) => f.property).slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Bonjour {user?.name?.split(" ")[0] ?? ""}
        </h1>
        <p className="text-sm text-muted-foreground">Voici un aperçu de votre recherche de logement.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition hover:border-primary hover:shadow-sm">
              <CardHeader className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <stat.icon size={18} />
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="font-heading text-2xl font-bold">{stat.value ?? "—"}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {prochaineVisite && (
        <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
          <div className="flex items-center gap-2 text-secondary">
            <CalendarCheck size={18} />
            <h2 className="font-heading font-semibold">Prochaine visite confirmée</h2>
          </div>
          <p className="mt-2 font-medium">{prochaineVisite.property?.title ?? "Annonce"}</p>
          <p className="text-sm text-muted-foreground">
            {prochaineVisite.date_souhaitee} · {prochaineVisite.property?.ville}
          </p>
          {prochaineVisite.note_proprietaire && (
            <p className="mt-2 text-sm text-muted-foreground">
              Note du propriétaire : {prochaineVisite.note_proprietaire}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ButtonLink href="/listings" className="justify-center gap-2">
          <Search size={16} />
          Chercher une maison
        </ButtonLink>
        <ButtonLink href="/dashboard/profile" variant="outline" className="justify-center gap-2">
          <UserCog size={16} />
          Compléter mon profil
        </ButtonLink>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading font-semibold">Mes derniers favoris</h2>
          {derniersFavoris.length > 0 && (
            <Link
              href="/dashboard/favoris"
              className="flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          )}
        </div>
        {favoris.isLoading ? (
          <LoadingState />
        ) : derniersFavoris.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore de favoris.</p>
            <ButtonLink href="/listings" size="sm">
              Parcourir les annonces
            </ButtonLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {derniersFavoris.map((f) => (
              <PropertyCard key={f.id} property={f.property!} isFavori />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
