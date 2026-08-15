import { DashboardShell } from "@/components/layout/DashboardShell";

const items = [
  { href: "/owner/dashboard", label: "Vue d'ensemble" },
  { href: "/owner/properties", label: "Mes annonces" },
  { href: "/owner/visites", label: "Visites reçues" },
  { href: "/owner/abonnement", label: "Abonnement" },
  { href: "/owner/paiements", label: "Paiements" },
  { href: "/owner/support", label: "Support" },
  { href: "/owner/profile", label: "Profil" },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
