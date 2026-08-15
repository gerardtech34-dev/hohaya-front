"use client";

import { use, useEffect, useState } from "react";
import { verifyEmail } from "@/lib/api/auth";
import { ButtonLink } from "@/components/ui/button-link";

export default function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; hash: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { id, hash } = use(params);
  const query = use(searchParams);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const qs = new URLSearchParams(query).toString();
    verifyEmail(id, hash, qs ? `?${qs}` : "")
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hash]);

  return (
    <div className="space-y-4 text-center">
      {status === "loading" && <p>Vérification en cours...</p>}
      {status === "success" && (
        <>
          <h1 className="text-xl font-semibold">Email vérifié</h1>
          <p className="text-sm text-muted-foreground">Votre adresse email a été confirmée.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-xl font-semibold">Lien invalide ou expiré</h1>
          <p className="text-sm text-muted-foreground">Demandez un nouveau lien depuis votre compte.</p>
        </>
      )}
      <ButtonLink href="/login">Aller à la connexion</ButtonLink>
    </div>
  );
}
