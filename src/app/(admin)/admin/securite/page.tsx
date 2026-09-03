import { TwoFactorSettings } from "@/components/profile/TwoFactorSettings";

export default function AdminSecuritePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Sécurité</h1>
        <p className="text-sm text-muted-foreground">
          Renforcez la sécurité de votre compte administrateur.
        </p>
      </div>
      <TwoFactorSettings />
    </div>
  );
}
