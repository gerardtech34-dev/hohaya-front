"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/apply-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";

const schema = z.object({ email: z.string().email("Email invalide") });
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await forgotPassword(values);
      setSent(true);
      toast.success("Email de réinitialisation envoyé.");
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Email envoyé</h1>
        <p className="text-sm text-muted-foreground">
          Vérifiez votre boîte mail pour réinitialiser votre mot de passe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground">
          Indiquez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer le lien"}
        </Button>
      </form>
    </div>
  );
}
