"use client";

import { Home, Building2, CalendarCheck, Users2, Wallet, Headset, UserCog, Contact } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

// Module "Abonnement" mis en veille (2026-09) : lien retiré de la nav, pages/API conservées
// intactes pour réactivation rapide — voir TODO_APPEL_2026-09-XX.md.
const items = [
  { href: "/owner/dashboard", label: "Vue d'ensemble", icon: Home },
  { href: "/owner/properties", label: "Mes annonces", icon: Building2 },
  { href: "/owner/contacts", label: "Chercheurs intéressés", icon: Contact },
  { href: "/owner/visites", label: "Visites reçues", icon: CalendarCheck },
  { href: "/owner/locataires", label: "Locataires", icon: Users2 },
  { href: "/owner/paiements", label: "Paiements", icon: Wallet },
  { href: "/owner/support", label: "Support", icon: Headset },
  { href: "/owner/profile", label: "Profil", icon: UserCog },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
