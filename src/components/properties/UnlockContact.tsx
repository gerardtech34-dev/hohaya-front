"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Phone, Mail, Copy, PhoneCall, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useAuth } from "@/lib/auth/AuthContext";
import * as contactsApi from "@/lib/api/contacts";
import { setTokens } from "@/lib/auth/token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}

export function UnlockContact({ propertyId, compact = false }: { propertyId: number; compact?: boolean }) {
  const { user, role, refreshMe } = useAuth();
  const [payment, setPayment] = useState<contactsApi.ContactPaymentIntent | null>(null);
  const [contact, setContact] = useState<contactsApi.ContactInfo | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [userFirst, ...userRest] = (user?.name ?? "").split(" ");
  const [prenom, setPrenom] = useState(userFirst ?? "");
  const [nom, setNom] = useState(userRest.join(" "));
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  if (role === "owner" || role === "admin") return null;

  const applyResult = (res: contactsApi.InitierContactResult) => {
    if ("access" in res && res.access) {
      setContact(res);
    } else {
      setPayment(res as contactsApi.ContactPaymentIntent);
    }
  };

  const continueClick = async () => {
    if (user) {
      setLoading(true);
      try {
        const res = await contactsApi.initier(propertyId);
        applyResult(res);
        setOpen(false);
      } catch {
        toast.error("Impossible d'initier le paiement.");
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
      const res = await contactsApi.guestInitier({
        property_id: propertyId,
        name: `${prenom.trim()} ${nom.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
      });
      setTokens(res.access_token, res.refresh_token);
      await refreshMe();
      applyResult(res);
      setOpen(false);
    } catch {
      toast.error("Impossible d'initier le paiement.");
    } finally {
      setLoading(false);
    }
  };

  const confirmWithRetry = async (paiementId: number, transactionId: string, attempt = 1) => {
    setConfirming(true);
    try {
      const res = await contactsApi.confirmer({ paiement_id: paiementId, transaction_id: transactionId });
      if ("pending" in res) {
        if (attempt >= MAX_RETRIES) {
          setConfirming(false);
          toast.error("Le paiement met plus de temps que prévu à se confirmer. Réessayez dans un instant.");
          return;
        }
        setTimeout(() => confirmWithRetry(paiementId, transactionId, attempt + 1), RETRY_DELAY_MS);
        return;
      }
      setContact(res);
      setSuccessOpen(true);
      setConfirming(false);
      toast.success("Contact débloqué !");
    } catch {
      setConfirming(false);
      toast.error("La confirmation du paiement a échoué.");
    }
  };

  if (contact) {
    return (
      <>
        <div className="space-y-2 rounded-2xl border border-border bg-card p-3 text-sm">
          <p className="font-medium">{contact.proprietaire.nom}</p>
          {contact.proprietaire.telephone && (
            <div className="flex flex-wrap items-center gap-1.5">
              <a
                href={`tel:${contact.proprietaire.telephone}`}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/20"
              >
                <PhoneCall size={12} /> Appeler
              </a>
              <a
                href={waLink(contact.proprietaire.telephone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary transition hover:bg-secondary/20"
              >
                <WhatsAppIcon size={12} /> WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(contact.proprietaire.telephone!);
                  toast.success("Numéro copié.");
                }}
                className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted/70"
              >
                <Copy size={12} /> {contact.proprietaire.telephone}
              </button>
            </div>
          )}
          {contact.proprietaire.email && <p className="text-muted-foreground">{contact.proprietaire.email}</p>}
        </div>

        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent>
            <DialogHeader>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <CheckCircle2 size={28} />
              </div>
              <DialogTitle className="text-center">Contact débloqué !</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 rounded-2xl border border-border bg-card p-4 text-sm">
              <p className="text-center font-medium">{contact.proprietaire.nom}</p>
              {contact.proprietaire.telephone && (
                <>
                  <p className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Phone size={14} /> {contact.proprietaire.telephone}
                  </p>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.proprietaire.telephone}`} className="flex-1">
                      <Button variant="outline" className="w-full gap-1.5">
                        <PhoneCall size={15} /> Appeler
                      </Button>
                    </a>
                    <a
                      href={waLink(contact.proprietaire.telephone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/85">
                        <WhatsAppIcon size={15} /> WhatsApp
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Copier le numéro"
                      onClick={() => {
                        navigator.clipboard.writeText(contact.proprietaire.telephone!);
                        toast.success("Numéro copié.");
                      }}
                    >
                      <Copy size={15} />
                    </Button>
                  </div>
                </>
              )}
              {contact.proprietaire.email && (
                <p className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail size={14} /> {contact.proprietaire.email}
                </p>
              )}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Ces coordonnées vous ont aussi été envoyées par email.
            </p>
            <DialogFooter>
              <Button className="w-full" onClick={() => setSuccessOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
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
      <FedaPayButton
        amount={payment.montant}
        publicKey={payment.fedapay_public_key}
        sandbox={payment.sandbox}
        label="Payer et débloquer"
        autoOpen
        customer={{
          firstname: prenom || undefined,
          lastname: nom || undefined,
          email: email || undefined,
          phone: phone || undefined,
        }}
        onSuccess={(transactionId) => confirmWithRetry(payment.paiement_id, transactionId)}
      />
    );
  }

  const label = "Contacter le propriétaire";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full animate-attention truncate whitespace-nowrap bg-secondary text-secondary-foreground hover:bg-secondary/85">
            {compact ? "Contacter propriétaire" : label}
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
              <Label htmlFor="guest-prenom">Prénom</Label>
              <Input id="guest-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guest-nom">Nom</Label>
              <Input id="guest-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="guest-email">Email</Label>
            <Input id="guest-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="guest-phone">Téléphone</Label>
            <Input id="guest-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
