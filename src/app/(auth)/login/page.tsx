"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/AuthContext";
import { handleApiError } from "@/lib/api/apply-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";

const schema = z.object({
  identifier: z.string().min(3, "Email ou téléphone requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const isEmail = values.identifier.includes("@");
    try {
      await login({
        email: isEmail ? values.identifier : undefined,
        phone: isEmail ? undefined : values.identifier,
        password: values.password,
      });
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Connexion</h1>
        <p className="text-sm text-muted-foreground">Accédez à votre espace Hohaya</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="identifier">Email ou téléphone</Label>
          <Input id="identifier" {...register("identifier")} />
          <FieldError message={errors.identifier?.message} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <Input id="password" type="password" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-foreground underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
