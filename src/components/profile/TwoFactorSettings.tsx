"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/AuthContext";
import * as authApi from "@/lib/api/auth";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck } from "lucide-react";

export function TwoFactorSettings() {
  const { user, refreshMe } = useAuth();

  const toggle = useMutation({
    mutationFn: (enabled: boolean) => authApi.updateTwoFactorSetting(enabled),
    onSuccess: async () => {
      toast.success("Préférence de sécurité mise à jour.");
      await refreshMe();
    },
    onError: () => toast.error("Impossible de mettre à jour la double authentification."),
  });

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-heading font-semibold">
            <ShieldCheck size={17} className="text-primary" />
            Double authentification
          </h2>
          <p className="text-xs text-muted-foreground">
            Ajoute un code envoyé par email à chaque connexion, en plus de votre mot de passe.
          </p>
        </div>
        <Switch
          checked={user?.two_factor_enabled ?? false}
          onCheckedChange={(checked) => toggle.mutate(checked === true)}
          disabled={toggle.isPending}
        />
      </div>
    </div>
  );
}
