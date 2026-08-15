import { Navbar } from "@/components/layout/Navbar";
import { VerifyEmailBanner } from "@/components/layout/VerifyEmailBanner";
import { DashboardSidebar, type DashboardNavItem } from "@/components/layout/DashboardSidebar";

export function DashboardShell({
  items,
  children,
}: {
  items: DashboardNavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <VerifyEmailBanner />
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row">
        <DashboardSidebar items={items} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
