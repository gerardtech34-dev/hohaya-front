"use client";

import { use } from "react";
import { MailCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export default function VerifiezVotreEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = use(searchParams);

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <MailCheck size={40} className="text-primary" />
      </div>
      <h1 className="text-xl font-semibold">Vérifiez votre boîte mail</h1>
      <p className="text-sm text-muted-foreground">
        Votre compte a été créé{email ? ` avec l'adresse ${email}` : ""}. Cliquez sur le lien reçu
        par email pour valider votre adresse et accéder à votre tableau de bord.
      </p>
      <ButtonLink href="/login">Aller à la connexion</ButtonLink>
    </div>
  );
}
