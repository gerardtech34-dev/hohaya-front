"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    FedaPay?: {
      init: (options: Record<string, unknown>) => { open: () => void };
    };
  }
}

export function FedaPayButton({
  amount,
  publicKey,
  sandbox = true,
  label = "Payer",
  disabled,
  customer,
  autoOpen = false,
  onSuccess,
}: {
  amount: number;
  publicKey: string;
  sandbox?: boolean;
  label?: string;
  disabled?: boolean;
  customer?: { firstname?: string; lastname?: string; email?: string; phone?: string };
  autoOpen?: boolean;
  onSuccess: (transactionId: string) => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(autoOpen);
  const opened = useRef(false);

  const pay = () => {
    if (!window.FedaPay) {
      toast.error("Le module de paiement n'est pas encore prêt, réessayez.");
      return;
    }
    setLoading(true);
    const widget = window.FedaPay.init({
      public_key: publicKey,
      environment: sandbox ? "sandbox" : "live",
      transaction: {
        amount,
        description: "Paiement Hohaya",
      },
      customer: customer
        ? {
            firstname: customer.firstname,
            lastname: customer.lastname,
            email: customer.email,
            phone_number: customer.phone ? { number: customer.phone, country: "bj" } : undefined,
          }
        : undefined,
      onComplete: async (...args: unknown[]) => {
        try {
          // La forme exacte de ce callback varie selon les versions de Checkout.js
          // (reason, transaction) ou ({ reason, transaction }) — on cherche l'id
          // de transaction où qu'il se trouve plutôt que de dépendre d'une forme précise.
          let transactionId: string | undefined;
          for (const arg of args) {
            if (arg && typeof arg === "object") {
              const obj = arg as Record<string, unknown>;
              if (obj.id !== undefined) {
                transactionId = String(obj.id);
                break;
              }
              const nested = obj.transaction as Record<string, unknown> | undefined;
              if (nested?.id !== undefined) {
                transactionId = String(nested.id);
                break;
              }
            }
          }

          if (transactionId) {
            await onSuccess(transactionId);
          }
        } finally {
          setLoading(false);
        }
      },
    });
    widget.open();
  };

  useEffect(() => {
    if (!autoOpen || opened.current) return;
    let cancelled = false;
    const tryOpen = () => {
      if (cancelled || opened.current) return;
      if (window.FedaPay) {
        opened.current = true;
        pay();
      } else {
        setTimeout(tryOpen, 150);
      }
    };
    tryOpen();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (autoOpen && loading) {
    return (
      <>
        <Script src="https://cdn.fedapay.com/checkout.js?v=1.1.7" strategy="afterInteractive" />
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin" />
          Ouverture du paiement...
        </div>
      </>
    );
  }

  return (
    <>
      <Script src="https://cdn.fedapay.com/checkout.js?v=1.1.7" strategy="afterInteractive" />
      <Button className="w-full" onClick={pay} disabled={disabled || loading}>
        {loading ? "Traitement..." : autoOpen ? "Réessayer le paiement" : label}
      </Button>
    </>
  );
}
