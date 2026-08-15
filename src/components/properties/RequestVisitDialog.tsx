"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { demanderVisite } from "@/lib/api/chercheur";
import { handleApiError } from "@/lib/api/apply-errors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RequestVisitDialog({ propertyId }: { propertyId: number }) {
  const { user, role } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Button className="w-full" onClick={() => router.push("/login")}>
        Se connecter pour demander une visite
      </Button>
    );
  }

  if (role !== "seeker") return null;

  const submit = async () => {
    if (!date) {
      toast.error("Merci d'indiquer une date souhaitée.");
      return;
    }
    setLoading(true);
    try {
      await demanderVisite({
        id_property: propertyId,
        date_souhaitee: date.replace("T", " ") + ":00",
        message: message || undefined,
      });
      toast.success("Demande de visite envoyée.");
      setOpen(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full">Demander une visite</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demander une visite</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date souhaitée</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div>
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Envoi..." : "Envoyer la demande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
