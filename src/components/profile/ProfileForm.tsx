"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import * as userApi from "@/lib/api/user";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FormValues = { name: string; email: string; phone: string; adress: string };

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Le mot de passe actuel est obligatoire."),
    password: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères."),
    password_confirmation: z.string().min(1, "Veuillez confirmer le nouveau mot de passe."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "La confirmation ne correspond pas au nouveau mot de passe.",
    path: ["password_confirmation"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfileForm() {
  const { user, refreshMe } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      adress: user?.adress ?? "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    setError: setPasswordError,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });

  if (!user) return null;

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await userApi.updateProfile(values);
      await refreshMe();
      toast.success("Profil mis à jour.");
    } catch {
      toast.error("Impossible de mettre à jour le profil.");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setPasswordLoading(true);
    try {
      await userApi.updatePassword(values);
      toast.success("Mot de passe mis à jour.");
      resetPasswordForm();
    } catch (err) {
      if (err instanceof ApiError && err.errors?.current_password) {
        setPasswordError("current_password", { message: err.errors.current_password[0] });
      } else {
        toast.error("Impossible de mettre à jour le mot de passe.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      await userApi.uploadAvatar(file);
      await refreshMe();
      toast.success("Photo de profil mise à jour.");
    } catch {
      toast.error("Échec de l'envoi de la photo.");
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="font-heading text-2xl font-bold">Mon profil</h1>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={avatarLoading}>
                {avatarLoading ? "Envoi..." : "Changer la photo"}
              </Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" {...register("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" placeholder="+2290197000000" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adress">Adresse</Label>
              <Input id="adress" {...register("adress")} />
            </div>
            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </div>

        <div className="space-y-5 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <h2 className="font-heading text-lg font-bold">Changer le mot de passe</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Mot de passe actuel</Label>
              <PasswordInput id="current_password" {...registerPassword("current_password")} />
              {passwordErrors.current_password && (
                <p className="text-sm text-destructive">{passwordErrors.current_password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <PasswordInput id="password" {...registerPassword("password")} />
              {passwordErrors.password && (
                <p className="text-sm text-destructive">{passwordErrors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</Label>
              <PasswordInput id="password_confirmation" {...registerPassword("password_confirmation")} />
              {passwordErrors.password_confirmation && (
                <p className="text-sm text-destructive">{passwordErrors.password_confirmation.message}</p>
              )}
            </div>
            <Button type="submit" className="mt-2" disabled={passwordLoading}>
              {passwordLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
