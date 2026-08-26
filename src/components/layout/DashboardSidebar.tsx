"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";

export type DashboardNavItem = { href: string; label: string; icon?: LucideIcon };

export function DashboardSidebarNav({
  items,
  onNavigate,
}: {
  items: DashboardNavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"
            )}
          >
            {item.icon && <item.icon size={18} className="shrink-0" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar({ items, homeHref }: { items: DashboardNavItem[]; homeHref: string }) {
  return (
    <aside className="hidden shrink-0 border-r border-border md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:overflow-y-auto">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <Link href={homeHref}>
          <Logo size="sm" />
        </Link>
      </div>
      <div className="flex-1 p-3">
        <DashboardSidebarNav items={items} />
      </div>
    </aside>
  );
}
