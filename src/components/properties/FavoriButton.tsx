"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { toggleFavori } from "@/lib/api/chercheur";
import { Button } from "@/components/ui/button";

export function FavoriButton({ propertyId, initial = false }: { propertyId: number; initial?: boolean }) {
  const { user, role } = useAuth();
  const [active, setActive] = useState(initial);
  const [loading, setLoading] = useState(false);

  if (!user || role !== "seeker") return null;

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await toggleFavori(propertyId);
      setActive(res.favori);
    } catch {
      toast.error("Impossible de mettre à jour vos favoris.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="h-8 w-8 rounded-full shadow"
      onClick={onClick}
      disabled={loading}
    >
      <Heart className={active ? "fill-red-500 text-red-500" : ""} size={16} />
    </Button>
  );
}
