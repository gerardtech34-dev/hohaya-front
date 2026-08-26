"use client";

import { Home, Building2, CalendarCheck, Users2, CreditCard, Wallet, Headset, UserCog } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

const items = [
  { href: "/owner/dashboard", label: "Vue d'ensemble", icon: Home },
  { href: "/owner/properties", label: "Mes annonces", icon: Building2 },
  { href: "/owner/visites", label: "Visites reçues", icon: CalendarCheck },
  { href: "/owner/locataires", label: "Locataires", icon: Users2 },
  { href: "/owner/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/owner/paiements", label: "Paiements", icon: Wallet },
  { href: "/owner/support", label: "Support", icon: Headset },
  { href: "/owner/profile", label: "Profil", icon: UserCog },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
