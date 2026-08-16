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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z
  .object({
    name: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    password: z.string().min(8, "8 caractères minimum"),
    password_confirmation: z.string(),
    role: z.enum(["owner", "seeker"], { message: "Choisissez un profil" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  })
  .refine((data) => data.email || data.phone, {
    message: "Email ou téléphone requis",
    path: ["email"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "seeker" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        password: values.password,
        password_confirmation: values.password_confirmation,
        role: values.role,
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
        <h1 className="text-xl font-semibold">Créer un compte</h1>
        <p className="text-sm text-muted-foreground">Rejoignez Hohaya en quelques secondes</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Je suis</Label>
          <Select value={watch("role")} onValueChange={(v) => setValue("role", v as "owner" | "seeker")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un profil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seeker">À la recherche d&apos;un logement</SelectItem>
              <SelectItem value="owner">Propriétaire / bailleur</SelectItem>
            </SelectContent>
          </Select>
          <FieldError message={errors.role?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...register("password")} />
          <FieldError message={errors.password?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
          <Input id="password_confirmation" type="password" {...register("password_confirmation")} />
          <FieldError message={errors.password_confirmation?.message} />
        </div>

        <Button type="submit" className="mt-2 w-full" disabled={loading}>
          {loading ? "Création..." : "Créer mon compte"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
