"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { resendVerification } from "@/lib/api/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function VerifyEmailBanner() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user || user.email_verified_at) return null;

  const resend = async () => {
    setLoading(true);
    try {
      await resendVerification();
      toast.success("Email de vérification renvoyé.");
    } catch {
      toast.error("Impossible d'envoyer l'email pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Alert className="rounded-none border-x-0 border-t-0">
      <AlertTitle>Email non vérifié</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>Vérifiez votre adresse email pour accéder à toutes les fonctionnalités.</span>
        <Button size="sm" variant="outline" onClick={resend} disabled={loading}>
          {loading ? "Envoi..." : "Renvoyer"}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
