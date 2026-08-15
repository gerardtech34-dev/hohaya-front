import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Produit",
    links: [
      { href: "/annonces", label: "Annonces" },
      { href: "/tarifs", label: "Tarifs propriétaires" },
      { href: "/comment-ca-marche", label: "Comment ça marche" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Support" },
      { href: "/a-propos", label: "À propos" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
      { href: "/cgu", label: "Conditions d'utilisation" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <Logo size="sm" />
            <p className="max-w-xs text-sm text-muted-foreground">
              Trouvez ou publiez un logement en toute confiance, partout au Bénin.
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
                  <li key={l.href}>
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
          <div className="flex items-center gap-1.5 text-secondary">
            <ShieldCheck size={16} />
            <span>Paiement sécurisé Mobile Money / KKiaPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
