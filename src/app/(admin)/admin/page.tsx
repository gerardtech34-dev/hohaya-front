"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users, Building2, Wallet, Headset, TrendingUp, AlertTriangle, CheckCircle2, Tag, Flag, ArrowRight } from "lucide-react";
import * as adminApi from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { formatPrix } from "@/lib/format";

const QUICK_ACTIONS = [
  { icon: CheckCircle2, label: "Valider des annonces", href: "/admin/properties" },
  { icon: Users, label: "Gérer les utilisateurs", href: "/admin/users" },
  { icon: Tag, label: "Ajuster les tarifs", href: "/admin/tarifs" },
  { icon: Flag, label: "Traiter les signalements", href: "/admin/signalements" },
];

const HERO_STATS = [
  { icon: Users, label: "Utilisateurs", get: (d: adminApi.AdminDashboardStats) => d.users.total, href: "/admin/users" },
  { icon: Building2, label: "Annonces", get: (d: adminApi.AdminDashboardStats) => d.properties.total, href: "/admin/properties" },
  { icon: Wallet, label: "Revenus ce mois", get: (d: adminApi.AdminDashboardStats) => formatPrix(d.revenus.ce_mois), href: "/admin/paiements" },
  { icon: Headset, label: "Tickets ouverts", get: (d: adminApi.AdminDashboardStats) => d.support.ouverts, href: "/admin/support" },
];

const DETAIL_SECTIONS: {
  title: string;
  rows: { label: string; get: (d: adminApi.AdminDashboardStats) => number | string }[];
}[] = [
  {
    title: "Utilisateurs",
    rows: [
      { label: "Propriétaires", get: (d) => d.users.proprietaires },
      { label: "Propriétaires vérifiés", get: (d) => d.users.verifies },
      { label: "Chercheurs", get: (d) => d.users.chercheurs },
      { label: "Nouveaux (30j)", get: (d) => d.users.nouveaux_30j },
    ],
  },
  {
    title: "Annonces",
    rows: [
      { label: "Disponibles", get: (d) => d.properties.disponibles },
      { label: "Vérifiées", get: (d) => d.properties.verifiees },
      { label: "En attente de vérification", get: (d) => d.properties.en_attente },
      { label: "Nouvelles (30j)", get: (d) => d.properties.nouvelles_30j },
    ],
  },
  {
    title: "Abonnements & revenus",
    rows: [
      { label: "Abonnements actifs", get: (d) => d.abonnements.actifs },
      { label: "Expirent sous 7j", get: (d) => d.abonnements.expires_7j },
      { label: "Revenus totaux", get: (d) => formatPrix(d.revenus.total) },
      { label: "Revenus mois dernier", get: (d) => formatPrix(d.revenus.mois_dernier) },
    ],
  },
  {
    title: "Support & paiements",
    rows: [
      { label: "Tickets en cours", get: (d) => d.support.en_cours },
      { label: "Paiements en attente", get: (d) => d.paiements.en_attente },
      { label: "Paiements échoués (7j)", get: (d) => d.paiements.echoues_7j },
    ],
  },
];

export default function AdminDashboardPage() {
  const dashboard = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminApi.dashboard });
  const revenus = useQuery({ queryKey: ["admin-revenus"], queryFn: adminApi.revenusMensuels });
  const pending = useQuery({ queryKey: ["admin-properties-pending"], queryFn: adminApi.annoncesEnAttente });
  const d = dashboard.data;
  const dernieresEnAttente = pending.data?.data.slice(0, 3) ?? [];

  const alerts = d
    ? [
        d.properties.en_attente > 0 && {
          message: `${d.properties.en_attente} annonce${d.properties.en_attente > 1 ? "s" : ""} en attente de vérification.`,
          href: "/admin/properties",
        },
        d.paiements.en_attente > 0 && {
          message: `${d.paiements.en_attente} paiement${d.paiements.en_attente > 1 ? "s" : ""} en attente.`,
          href: "/admin/paiements",
        },
        d.support.ouverts > 0 && {
          message: `${d.support.ouverts} ticket${d.support.ouverts > 1 ? "s" : ""} de support ouvert${d.support.ouverts > 1 ? "s" : ""}.`,
          href: "/admin/support",
        },
      ].filter(Boolean)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Vue d&apos;ensemble</h1>
        <p className="text-sm text-muted-foreground">Statistiques globales de la plateforme Hohaya.</p>
      </div>

      {dashboard.isLoading ? (
        <LoadingState />
      ) : !d ? (
        <p className="text-sm text-muted-foreground">Impossible de charger les statistiques.</p>
      ) : (
        <>
          {alerts.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {alerts.map((a) =>
                a ? (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex items-center gap-2 rounded-2xl border border-accent/40 bg-accent/10 p-3 text-sm text-accent-foreground transition hover:bg-accent/15"
                  >
                    <AlertTriangle size={16} className="shrink-0" />
                    <span className="truncate">{a.message}</span>
                  </Link>
                ) : null
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition hover:border-primary hover:shadow-sm">
                  <CardHeader className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <stat.icon size={18} />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="font-heading text-2xl font-bold">{stat.get(d)}</CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="mb-3 font-heading font-semibold">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 text-sm font-medium transition hover:border-primary hover:shadow-sm"
                >
                  <action.icon size={16} className="shrink-0 text-primary" />
                  <span className="truncate">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {dernieresEnAttente.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-heading font-semibold">Annonces en attente de vérification</h2>
                <Link
                  href="/admin/properties"
                  className="flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                >
                  Voir tout <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-2">
                {dernieresEnAttente.map((p) => (
                  <Link
                    key={p.id}
                    href="/admin/properties"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 text-sm transition hover:border-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.ville}</p>
                    </div>
                    <span className="shrink-0 font-medium text-primary">{formatPrix(p.prix_loyer, p.devise)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DETAIL_SECTIONS.map((section) => (
              <div key={section.title} className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-3 font-heading font-semibold">{section.title}</h2>
                <dl className="space-y-2">
                  {section.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="font-medium">{row.get(d)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </>
      )}

      <div>
        <h2 className="mb-3 flex items-center gap-2 font-heading font-semibold">
          <TrendingUp size={18} className="text-primary" />
          Revenus mensuels
        </h2>
        {revenus.isLoading ? (
          <LoadingState />
        ) : !revenus.data || revenus.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
        ) : (
          <div className="space-y-2 rounded-2xl border border-border bg-card p-5">
            {revenus.data.map((r) => (
              <div key={r.mois} className="flex items-center justify-between text-sm">
                <span className="w-16 shrink-0 text-muted-foreground">{r.mois}</span>
                <div className="flex flex-1 items-center gap-2 px-4">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, (r.montant / Math.max(...revenus.data.map((x) => x.montant), 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="w-28 shrink-0 text-right font-medium">{formatPrix(r.montant)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
