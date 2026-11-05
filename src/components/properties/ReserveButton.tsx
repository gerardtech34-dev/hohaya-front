"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import * as reservationsApi from "@/lib/api/reservations";
import { setTokens } from "@/lib/auth/token";
import { formatPrix } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import { FedaPayButton } from "@/components/payments/FedaPayButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 4000;

export function ReserveButton({ propertyId, compact = false }: { propertyId: number; compact?: boolean }) {
  const { user, role, refreshMe } = useAuth();
  const [payment, setPayment] = useState<reservationsApi.ReservationPaymentIntent | null>(null);
  const [confirmed, setConfirmed] = useState<reservationsApi.ReservationConfirmed | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user) return;
    const [first, ...rest] = (user.name ?? "").split(" ");
    setPrenom((p) => p || first || "");
    setNom((n) => n || rest.join(" "));
    setEmail((e) => e || user.email || "");
    setPhone((ph) => ph || user.phone || "");
  }, [user]);

  if (role === "owner" || role === "admin") return null;

  const continueClick = async () => {
    if (user) {
      setLoading(true);
      try {
        const res = await reservationsApi.initier(propertyId);
        setPayment(res);
        setOpen(false);
      } catch {
        toast.error("Impossible d'initier la réservation.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!prenom.trim() || !nom.trim() || !email.trim() || !phone.trim()) {
      toast.error("Merci de renseigner votre prénom, nom, email et téléphone.");
      return;
    }
    setLoading(true);
    try {
      const res = await reservationsApi.guestInitier({
        property_id: propertyId,
        name: `${prenom.trim()} ${nom.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
      });
      setTokens(res.access_token, res.refresh_token);
      await refreshMe();
      setPayment(res);
      setOpen(false);
    } catch {
      toast.error("Impossible d'initier la réservation.");
    } finally {
      setLoading(false);
    }
  };

  const confirmWithRetry = async (paiementId: number, transactionId: string, attempt = 1) => {
    setConfirming(true);
    try {
      const res = await reservationsApi.confirmer({ paiement_id: paiementId, transaction_id: transactionId });
      if ("pending" in res) {
        if (attempt >= MAX_RETRIES) {
          setConfirming(false);
          toast.error("Le paiement met plus de temps que prévu à se confirmer. Réessayez dans un instant.");
          return;
        }
        setTimeout(() => confirmWithRetry(paiementId, transactionId, attempt + 1), RETRY_DELAY_MS);
        return;
      }
      setConfirmed(res);
      setConfirming(false);
      toast.success("Réservation confirmée !");
    } catch {
      setConfirming(false);
      toast.error("La confirmation du paiement a échoué.");
    }
  };

  if (confirmed) {
    return (
      <div className="space-y-2 rounded-2xl border border-secondary/40 bg-secondary/10 p-3 text-sm">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 shrink-0 text-secondary" size={18} />
          <p>{confirmed.message}</p>
        </div>
        {confirmed.lien_maps && (
          <a
            href={confirmed.lien_maps}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-6 flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
          >
            <MapPin size={12} /> Voir sur Google Maps
          </a>
        )}
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
        <Loader2 size={16} className="animate-spin" />
        Confirmation du paiement...
      </div>
    );
  }

  if (payment) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Avance de {payment.nb_avance} mois — {formatPrix(payment.montant, payment.devise)}
        </p>
        <FedaPayButton
          amount={payment.montant}
          publicKey={payment.fedapay_public_key}
          sandbox={payment.sandbox}
          label="Payer et réserver"
          autoOpen
          customer={{
            firstname: prenom || undefined,
            lastname: nom || undefined,
            email: email || undefined,
            phone: phone || undefined,
          }}
          onSuccess={(transactionId) => confirmWithRetry(payment.paiement_id, transactionId)}
        />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full truncate whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/85">
            Réserver
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrer les informations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reserve-guest-prenom">Prénom</Label>
              <Input id="reserve-guest-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reserve-guest-nom">Nom</Label>
              <Input id="reserve-guest-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reserve-guest-email">Email</Label>
            <Input id="reserve-guest-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reserve-guest-phone">Téléphone</Label>
            <Input
              id="reserve-guest-phone"
              placeholder="+2290197000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={continueClick} disabled={loading}>
            {loading ? "Chargement..." : "Continuer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
