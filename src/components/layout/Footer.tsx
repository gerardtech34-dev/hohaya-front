import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Locataires",
    links: [
      { href: "/listings", label: "Trouver une maison" },
      { href: "/how-it-works", label: "Comment ça marche" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Propriétaires",
    links: [
      { href: "/pricing", label: "Tarifs" },
      { href: "/how-it-works", label: "Publier une annonce" },
      { href: "/register", label: "Créer un compte" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "mailto:contact@hohaya.com", label: "Nous contacter" },
      { href: "/faq", label: "Aide" },
      { href: "/a-propos", label: "À propos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <Logo size="sm" />
            <p className="max-w-xs text-sm text-muted-foreground">
              Trouve ou publie une maison à louer en toute confiance, partout au Bénin.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} />
              <span>contact@hohaya.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              <span>Cotonou, Bénin</span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Hohaya. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/cgu" className="hover:text-primary">
              Conditions
            </Link>
            <Link href="/confidentialite" className="hover:text-primary">
              Confidentialité
            </Link>
            <Link href="/mentions-legales" className="hover:text-primary">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
