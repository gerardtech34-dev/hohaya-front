"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import * as contactsApi from "@/lib/api/contacts";
import { Button } from "@/components/ui/button";
import { KKiaPayButton } from "@/components/payments/KKiaPayButton";

export function UnlockContact({ propertyId }: { propertyId: number }) {
  const { user, role } = useAuth();
  const router = useRouter();
  const [payment, setPayment] = useState<contactsApi.ContactPaymentIntent | null>(null);
  const [contact, setContact] = useState<contactsApi.ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
        Se connecter pour voir le contact
      </Button>
    );
  }

  if (role !== "seeker") return null;

  const start = async () => {
    setLoading(true);
    try {
      const res = await contactsApi.initier(propertyId);
      if ("access" in res && res.access) {
        setContact(res);
      } else {
        setPayment(res as contactsApi.ContactPaymentIntent);
      }
    } catch {
      toast.error("Impossible d'initier le paiement.");
    } finally {
      setLoading(false);
    }
  };

  if (contact) {
    return (
      <div className="rounded-lg border p-3 text-sm">
        <p className="font-medium">{contact.proprietaire.nom}</p>
        {contact.proprietaire.telephone && <p>Tél : {contact.proprietaire.telephone}</p>}
        {contact.proprietaire.email && <p>Email : {contact.proprietaire.email}</p>}
      </div>
    );
  }

  if (!payment) {
    return (
      <Button variant="outline" className="w-full" onClick={start} disabled={loading}>
        {loading ? "Chargement..." : "Débloquer le contact du propriétaire"}
      </Button>
    );
  }

  return (
    <KKiaPayButton
      amount={payment.montant}
      publicKey={payment.kkiapay_public_key}
      sandbox={payment.sandbox}
      label="Payer et débloquer"
      onSuccess={async (transactionId) => {
        try {
          const info = await contactsApi.confirmer({
            paiement_id: payment.paiement_id,
            transaction_id: transactionId,
          });
          setContact(info);
          toast.success("Contact débloqué !");
        } catch {
          toast.error("La confirmation du paiement a échoué.");
        }
      }}
    />
  );
}
