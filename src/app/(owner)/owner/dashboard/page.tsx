"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Building2, CalendarCheck, CreditCard, Wallet, Home, PlusCircle, UserCog, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import * as propertiesApi from "@/lib/api/properties";
import * as abonnementsApi from "@/lib/api/abonnements";
import * as ownerVisitesApi from "@/lib/api/owner-visites";
import { formatPrix } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { LoadingState } from "@/components/ui/loading-state";

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const properties = useQuery({ queryKey: ["my-properties"], queryFn: () => propertiesApi.myProperties() });
  const abonnement = useQuery({ queryKey: ["abonnement-actif"], queryFn: abonnementsApi.actif });
  const visites = useQuery({ queryKey: ["visites-recues"], queryFn: ownerVisitesApi.visitesRecues });

  const actives = properties.data?.data.filter((p) => p.status === "disponible").length ?? 0;
  const enAttente = visites.data?.data.filter((v) => v.status === "en_attente").length ?? 0;
  const total = properties.data?.total ?? 0;

  const STATS = [
    { icon: Building2, label: "Annonces actives", value: actives, href: "/owner/properties" },
    { icon: CalendarCheck, label: "Visites en attente", value: enAttente, href: "/owner/visites" },
    {
      icon: CreditCard,
      label: "Abonnement",
      value: abonnement.data ? abonnement.data.type_label : "Inactif",
      href: "/owner/abonnement",
    },
    { icon: Wallet, label: "Total annonces", value: total, href: "/owner/properties" },
  ];

  const dernieresAnnonces = properties.data?.data.slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Bonjour {user?.name?.split(" ")[0] ?? ""}</h1>
        <p className="text-sm text-muted-foreground">Voici un aperçu de votre activité sur Hohaya.</p>
      </div>

      {!abonnement.isLoading && !abonnement.data && (
        <Alert>
          <AlertTitle>Aucun abonnement actif</AlertTitle>
          <AlertDescription>
            Souscrivez à un abonnement pour publier vos annonces.{" "}
            <Link href="/owner/abonnement" className="underline">
              Voir les tarifs
            </Link>
          </AlertDescription>
        </Alert>
      )}

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
              <CardContent className="font-heading text-2xl font-bold capitalize">{stat.value}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ButtonLink href="/owner/properties/new" className="justify-center gap-2">
          <PlusCircle size={16} />
          Publier une annonce
        </ButtonLink>
        <ButtonLink href="/owner/profile" variant="outline" className="justify-center gap-2">
          <UserCog size={16} />
          Compléter mon profil
        </ButtonLink>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading font-semibold">Mes dernières annonces</h2>
          {dernieresAnnonces.length > 0 && (
            <Link
              href="/owner/properties"
              className="flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          )}
        </div>
        {properties.isLoading ? (
          <LoadingState />
        ) : dernieresAnnonces.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center">
            <Building2 className="text-muted-foreground" size={28} />
            <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore publié d&apos;annonce.</p>
            <ButtonLink href="/owner/properties/new" size="sm">
              Publier une annonce
            </ButtonLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {dernieresAnnonces.map((p) => {
              const image = p.images?.find((i) => i.is_principale)?.url ?? p.images?.[0]?.url;
              return (
                <Link
                  key={p.id}
                  href={`/owner/properties`}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {image ? (
                      <Image
                        src={image}
                        alt={p.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                        <Home size={40} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 p-3">
                    <h3 className="line-clamp-1 font-heading font-medium">{p.title}</h3>
                    <p className="truncate text-xs capitalize text-muted-foreground">{p.status}</p>
                    <p className="truncate font-semibold text-primary">
                      {formatPrix(p.prix_loyer, p.devise)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">/ mois</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
