import { DashboardShell } from "@/components/layout/DashboardShell";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/properties", label: "Annonces" },
  { href: "/admin/paiements", label: "Paiements" },
  { href: "/admin/tarifs", label: "Tarifs" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/signalements", label: "Signalements" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell items={items}>{children}</DashboardShell>;
}
