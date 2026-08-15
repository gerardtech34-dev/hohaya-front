"use client";

import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    openKkiapayWidget?: (config: Record<string, unknown>) => void;
    addSuccessListener?: (cb: (response: { transactionId: string }) => void) => void;
    removeSuccessListener?: () => void;
  }
}

export function KKiaPayButton({
  amount,
  publicKey,
  sandbox = true,
  label = "Payer",
  disabled,
  onSuccess,
}: {
  amount: number;
  publicKey: string;
  sandbox?: boolean;
  label?: string;
  disabled?: boolean;
  onSuccess: (transactionId: string) => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(false);

  const pay = () => {
    if (!window.openKkiapayWidget) {
      toast.error("Le module de paiement n'est pas encore prêt, réessayez.");
      return;
    }
    setLoading(true);
    window.addSuccessListener?.(async (response) => {
      try {
        await onSuccess(response.transactionId);
      } finally {
        setLoading(false);
      }
    });
    window.openKkiapayWidget({
      amount,
      key: publicKey,
      sandbox,
    });
  };

  return (
    <>
      <Script src="https://cdn.kkiapay.me/k.js" strategy="afterInteractive" />
      <Button onClick={pay} disabled={disabled || loading}>
        {loading ? "Traitement..." : label}
      </Button>
    </>
  );
}
