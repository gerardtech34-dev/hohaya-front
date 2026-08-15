import { PropertyForm } from "@/components/properties/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Publier une annonce</h1>
      <PropertyForm />
    </div>
  );
}
