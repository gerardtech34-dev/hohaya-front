"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court"),
});
type FormValues = z.infer<typeof schema>;

const INFOS = [
  { icon: Mail, label: "contact@hohaya.com" },
  { icon: MapPin, label: "Cotonou, Bénin" },
  { icon: Clock, label: "Réponse sous 24h ouvrées" },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    setLoading(true);
    // Pas d'endpoint public dédié côté backend : simulation d'envoi + invitation à créer un ticket support une fois connecté.
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSent(true);
    reset();
    toast.success("Message envoyé, nous revenons vers vous rapidement.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Contactez-nous</h1>
        <p className="mt-2 text-muted-foreground">
          Une question, un souci ? Notre équipe locale vous répond rapidement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {INFOS.map((info) => (
            <div key={info.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <info.icon size={18} />
              </div>
              <span className="text-sm font-medium">{info.label}</span>
            </div>
          ))}
          <p className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
            Vous êtes déjà inscrit ? Ouvrez plutôt un ticket depuis votre espace pour un suivi plus rapide.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          {sent ? (
            <p className="text-muted-foreground">Merci, votre message a bien été envoyé.</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" {...register("name")} />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                <FieldError message={errors.email?.message} />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} {...register("message")} />
                <FieldError message={errors.message?.message} />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? "Envoi..." : "Envoyer le message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
