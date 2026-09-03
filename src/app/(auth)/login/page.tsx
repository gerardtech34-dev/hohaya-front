"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { handleApiError } from "@/lib/api/apply-errors";
import * as authApi from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { OtpInput } from "@/components/auth/OtpInput";

const passwordSchema = z.object({
  identifier: z.string().min(3, "Email ou téléphone requis"),
  password: z.string().min(1, "Mot de passe requis"),
});
type PasswordFormValues = z.infer<typeof passwordSchema>;

const emailSchema = z.object({
  email: z.string().email("Email invalide"),
});
type EmailFormValues = z.infer<typeof emailSchema>;

type Step =
  | { mode: "password" }
  | { mode: "code_request" }
  | { mode: "code_verify"; email: string }
  | { mode: "two_factor"; userId: number };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login, completeTwoFactor, loginByCode } = useAuth();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const startInCodeVerify = searchParams.get("mode") === "code" && initialEmail;
  const [step, setStep] = useState<Step>(
    startInCodeVerify ? { mode: "code_verify", email: initialEmail } : { mode: "password" }
  );
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const passwordForm = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });
  const emailForm = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setLoading(true);
    const isEmail = values.identifier.includes("@");
    try {
      const outcome = await login({
        email: isEmail ? values.identifier : undefined,
        phone: isEmail ? undefined : values.identifier,
        password: values.password,
      });
      if (outcome.status === "two_factor_required") {
        setStep({ mode: "two_factor", userId: outcome.userId });
      }
    } catch (error) {
      handleApiError(error, passwordForm.setError);
    } finally {
      setLoading(false);
    }
  };

  const onRequestCode = async (values: EmailFormValues) => {
    setLoading(true);
    try {
      await authApi.requestLoginCode(values.email);
      toast.success("Code envoyé ! Allez le récupérer dans votre boîte mail.");
      setStep({ mode: "code_verify", email: values.email });
    } catch (error) {
      handleApiError(error, emailForm.setError);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Le code doit contenir 6 chiffres.");
      return;
    }
    setOtpError(null);
    setLoading(true);
    try {
      if (step.mode === "code_verify") {
        await loginByCode(step.email, otp);
      } else if (step.mode === "two_factor") {
        await completeTwoFactor(step.userId, otp);
      }
    } catch {
      setOtpError("Code invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  if (step.mode === "code_verify" || step.mode === "two_factor") {
    return (
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Entrez le code reçu</h1>
          <p className="text-sm text-muted-foreground">
            {step.mode === "code_verify"
              ? `Un code a été envoyé à ${step.email}.`
              : "Un code de double authentification a été envoyé à votre adresse email."}
          </p>
        </div>
        <OtpInput value={otp} onChange={setOtp} />
        <FieldError message={otpError ?? undefined} />
        <Button onClick={onVerifyOtp} className="w-full" disabled={loading}>
          {loading ? "Vérification..." : "Valider"}
        </Button>
        <button
          type="button"
          onClick={() => setStep({ mode: "password" })}
          className="w-full text-center text-sm text-muted-foreground underline"
        >
          Retour
        </button>
      </div>
    );
  }

  if (step.mode === "code_request") {
    return (
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Connexion par code</h1>
        </div>
        <form onSubmit={emailForm.handleSubmit(onRequestCode)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...emailForm.register("email")} />
            <FieldError message={emailForm.formState.errors.email?.message} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Envoi..." : "Recevoir un code"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setStep({ mode: "password" })}
          className="w-full text-center text-sm text-muted-foreground underline"
        >
          Se connecter avec un mot de passe
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">Connexion</h1>
        <p className="text-sm text-muted-foreground">Accédez à votre espace Hohaya</p>
      </div>

      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="identifier">Email ou téléphone</Label>
          <Input id="identifier" {...passwordForm.register("identifier")} />
          <FieldError message={passwordForm.formState.errors.identifier?.message} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <PasswordInput id="password" {...passwordForm.register("password")} />
          <FieldError message={passwordForm.formState.errors.password?.message} />
        </div>
        <Button type="submit" className="mt-2 w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setStep({ mode: "code_request" })}
        className="w-full text-center text-sm text-muted-foreground underline"
      >
        Chercheur ? Se connecter avec un code reçu par email
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-foreground underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
