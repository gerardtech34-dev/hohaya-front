import { Home } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 px-4 text-center">
      <Logo size="md" />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Home size={28} />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold">Page introuvable</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Cette page n&apos;existe pas ou plus. Elle a peut-être été déplacée.
        </p>
      </div>
      <div className="flex gap-3">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/listings" variant="outline">
          Voir les annonces
        </ButtonLink>
      </div>
    </div>
  );
}
