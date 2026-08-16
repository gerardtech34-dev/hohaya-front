"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/layout/Logo";

const NAV_LINKS = [
  { href: "/listings", label: "Annonces" },
  { href: "/how-it-works", label: "Comment ça marche" },
  { href: "/pricing", label: "Tarifs" },
  { href: "mailto:contact@hohaya.com", label: "Contact" },
];

function dashboardHref(role: string | null) {
  if (role === "owner") return "/owner/dashboard";
  if (role === "admin") return "/admin";
  return "/dashboard";
}

export function Navbar() {
  const { user, role, logout, isLoading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:h-20">
        <Link href="/" className="shrink-0">
          <Logo size="md" />
        </Link>

        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-foreground/80 transition hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar ?? undefined} />
                      <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={dashboardHref(role)}>Mon espace</Link>} />
                <DropdownMenuItem onClick={() => logout()}>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <ButtonLink variant="ghost" href="/login">
                Connexion
              </ButtonLink>
              <ButtonLink href="/register">Inscription</ButtonLink>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="md:hidden">
            <SheetHeader>
              <SheetTitle>
                <Logo size="sm" />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
              {isLoading ? null : user ? (
                <>
                  <ButtonLink href={dashboardHref(role)} onClick={() => setOpen(false)}>
                    Mon espace
                  </ButtonLink>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink href="/register" onClick={() => setOpen(false)}>
                    Inscription
                  </ButtonLink>
                  <ButtonLink variant="outline" href="/login" onClick={() => setOpen(false)}>
                    Connexion
                  </ButtonLink>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu />
        </Button>
      </div>
    </header>
  );
}
