"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type DashboardNavItem = { href: string; label: string };

export function DashboardSidebar({ items }: { items: DashboardNavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b md:w-56 md:border-b-0 md:border-r">
      <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
