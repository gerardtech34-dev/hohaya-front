import { ButtonLink } from "@/components/ui/button-link";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="text-muted-foreground">Vous n&apos;avez pas accès à cette page.</p>
      <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
    </div>
  );
}
