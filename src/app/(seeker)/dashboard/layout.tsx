"use client";

import { Home, Heart, CalendarCheck, KeyRound, Headset, UserCog } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";

const items = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: Home },
  { href: "/dashboard/favoris", label: "Favoris", icon: Heart },
  { href: "/dashboard/visites", label: "Mes visites", icon: CalendarCheck },
  { href: "/dashboard/contacts", label: "Contacts débloqués", icon: KeyRound },
  { href: "/dashboard/support", label: "Support", icon: Headset },
  { href: "/dashboard/profile", label: "Profil", icon: UserCog },
];

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
