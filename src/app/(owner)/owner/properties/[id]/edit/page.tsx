"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import * as propertiesApi from "@/lib/api/properties";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { MediaManager } from "@/components/properties/MediaManager";
import { LoadingState } from "@/components/ui/loading-state";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertiesApi.get(id),
  });

  if (isLoading) return <LoadingState />;
  if (!data) return <p className="text-muted-foreground">Annonce introuvable.</p>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 font-heading text-2xl font-bold">Modifier l&apos;annonce</h1>
        <PropertyForm property={data} />
      </div>
      <MediaManager propertyId={data.id} />
    </div>
  );
}
