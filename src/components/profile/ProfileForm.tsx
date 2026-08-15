"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import * as userApi from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FormValues = { name: string; email: string; phone: string; adress: string };

export function ProfileForm() {
  const { user, refreshMe, logout } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      adress: user?.adress ?? "",
    },
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

  const deleteAccount = async () => {
    try {
      await userApi.deleteAccount();
      toast.success("Compte supprimé.");
      await logout();
    } catch {
      toast.error("Impossible de supprimer le compte.");
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-semibold">Mon profil</h1>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar ?? undefined} />
          <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={avatarLoading}>
            {avatarLoading ? "Envoi..." : "Changer la photo"}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" {...register("name")} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="adress">Adresse</Label>
          <Input id="adress" {...register("adress")} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>

      <div className="rounded-xl border border-destructive/30 p-4">
        <h2 className="font-medium text-destructive">Zone de danger</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La suppression de votre compte est définitive.
        </p>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger render={<Button variant="destructive" className="mt-3">Supprimer mon compte</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
            <DialogFooter>
              <Button variant="destructive" onClick={deleteAccount}>
                Confirmer la suppression
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
