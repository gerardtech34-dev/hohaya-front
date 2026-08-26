import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar, type DashboardNavItem } from "@/components/layout/DashboardSidebar";

export function DashboardShell({
  items,
  children,
}: {
  items: DashboardNavItem[];
  children: React.ReactNode;
}) {
  const profileItem = items.find((i) => i.href.endsWith("/profile"));
  const homeHref = items[0]?.href ?? "/";

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar items={items} homeHref={homeHref} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader items={items} homeHref={homeHref} profileHref={profileItem?.href} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
