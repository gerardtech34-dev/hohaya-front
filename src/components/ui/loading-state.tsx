import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground", className)}>
      <Loader2 className="animate-spin text-primary" size={28} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
