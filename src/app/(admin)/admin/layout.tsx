"use client";

import { Gauge, Users, Users2, Building2, Wallet, Tag, Headset, Flag, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

const items = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/properties", label: "Annonces", icon: Building2 },
  { href: "/admin/locataires", label: "Locataires", icon: Users2 },
  { href: "/admin/paiements", label: "Paiements", icon: Wallet },
  { href: "/admin/tarifs", label: "Tarifs", icon: Tag },
  { href: "/admin/support", label: "Support", icon: Headset },
  { href: "/admin/signalements", label: "Signalements", icon: Flag },
  { href: "/admin/securite", label: "Sécurité", icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
