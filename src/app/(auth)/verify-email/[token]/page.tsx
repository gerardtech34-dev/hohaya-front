"use client";

import { use, useEffect, useRef, useState } from "react";
import { verifyEmail } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import { ButtonLink } from "@/components/ui/button-link";

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { applyAuthResult } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const called = useRef(false);

  useEffect(() => {
    // Garde contre le double-appel de React StrictMode en dev (et tout remount) :
    // la vérification appelle une route qui ne doit être consommée qu'une fois par affichage.
    if (called.current) return;
    called.current = true;

    verifyEmail(token).then(
      (result) => {
        // Séparé du second callback ci-dessous : une erreur ici (navigation, storage...) ne doit
        // jamais être confondue avec un lien invalide — l'email EST déjà vérifié à ce stade.
        setStatus("success");
        applyAuthResult(result);
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error("[verify-email] échec:", error);
        setStatus("error");
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="space-y-4 text-center">
      {status === "loading" && <p>Vérification en cours...</p>}
      {status === "success" && (
        <>
          <h1 className="text-xl font-semibold">Email vérifié</h1>
          <p className="text-sm text-muted-foreground">Redirection vers votre tableau de bord...</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-xl font-semibold">Lien invalide ou expiré</h1>
          <p className="text-sm text-muted-foreground">Demandez un nouveau lien depuis votre compte.</p>
          <ButtonLink href="/login">Aller à la connexion</ButtonLink>
        </>
      )}
    </div>
  );
}
