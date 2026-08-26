"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, LogOut, Menu, UserCog } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Logo } from "@/components/layout/Logo";
import { DashboardSidebarNav, type DashboardNavItem } from "@/components/layout/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABELS: Record<string, string> = {
  seeker: "Chercheur",
  owner: "Propriétaire",
  admin: "Admin",
};

export function DashboardHeader({
  items,
  homeHref,
  profileHref,
}: {
  items: DashboardNavItem[];
  homeHref: string;
  profileHref?: string;
}) {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon-lg" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={24} />
          </Button>
          <Link href={homeHref}>
            <Logo size="sm" />
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-2 rounded-full transition hover:opacity-80">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar ?? undefined} />
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <div className="space-y-1.5 px-2 py-1.5">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email ?? user?.phone}</p>
                {role && (
                  <Badge variant="outline" className="w-fit">
                    {ROLE_LABELS[role] ?? role}
                  </Badge>
                )}
              </div>
              <DropdownMenuSeparator />
              {profileHref && (
                <DropdownMenuItem render={<Link href={profileHref}><UserCog size={16} /> Mon profil</Link>} />
              )}
              <DropdownMenuItem render={<Link href="/"><ExternalLink size={16} /> Voir le site public</Link>} />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} variant="destructive">
                <LogOut size={16} /> Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="md:hidden">
          <SheetHeader>
            <SheetTitle>
              <Logo size="sm" />
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <DashboardSidebarNav items={items} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
