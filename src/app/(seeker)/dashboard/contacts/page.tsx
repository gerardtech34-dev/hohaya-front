"use client";

import { useQuery } from "@tanstack/react-query";
import { historique } from "@/lib/api/contacts";
import { formatPrix } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["contacts-historique"], queryFn: historique });
  const contacts = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contacts débloqués</h1>
      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : contacts.length === 0 ? (
        <p className="text-muted-foreground">Vous n&apos;avez pas encore débloqué de contact.</p>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
              <div className="min-w-0">
                <p className="font-medium">{c.property?.title ?? "Annonce"}</p>
                <p className="text-sm text-muted-foreground">Débloqué le {c.debloque_le}</p>
              </div>
              {c.paiement && (
                <span className="text-sm text-muted-foreground">
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
