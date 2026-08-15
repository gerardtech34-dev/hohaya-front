import { DashboardShell } from "@/components/layout/DashboardShell";

const items = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/favoris", label: "Favoris" },
  { href: "/dashboard/visites", label: "Mes visites" },
  { href: "/dashboard/contacts", label: "Contacts débloqués" },
  { href: "/dashboard/support", label: "Support" },
  { href: "/dashboard/profile", label: "Profil" },
];

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
