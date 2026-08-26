"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { KeyRound, Home } from "lucide-react";
import { historique } from "@/lib/api/contacts";
import { formatPrix } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button-link";
import { LoadingState } from "@/components/ui/loading-state";

export default function ContactsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["contacts-historique"], queryFn: historique });
  const contacts = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Contacts débloqués</h1>
      {isLoading ? (
        <LoadingState />
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <KeyRound className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore débloqué de contact.</p>
          <ButtonLink href="/listings" size="sm">
            Parcourir les annonces
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                {c.property?.media_principal ? (
                  <Image src={c.property.media_principal.url} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Home size={20} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {c.property ? (
                  <Link href={`/listings/${c.property.id}`} className="font-medium hover:text-primary">
                    {c.property.title}
                  </Link>
                ) : (
                  <p className="font-medium">Annonce</p>
                )}
                <p className="text-sm text-muted-foreground">Débloqué le {c.debloque_le}</p>
              </div>
              {c.paiement && (
                <span className="shrink-0 text-sm font-medium text-primary">
                  {formatPrix(c.paiement.montant, c.paiement.devise)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
