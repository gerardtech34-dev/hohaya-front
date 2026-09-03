import { ProfileForm } from "@/components/profile/ProfileForm";
import { TwoFactorSettings } from "@/components/profile/TwoFactorSettings";

export default function OwnerProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileForm />
      <TwoFactorSettings />
    </div>
  );
}
