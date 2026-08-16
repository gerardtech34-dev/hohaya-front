import Image from "next/image";
import { cn } from "@/lib/utils";

// Hauteurs intrinsèques (pour Next/Image), la taille réelle à l'écran est pilotée par les classes h-*.
const INTRINSIC_HEIGHT = { sm: 48, md: 64, lg: 80 };
// Ratio réel du fichier logo.png après recadrage (≈ 3.83:1)
const RATIO = 1457 / 380;

const SIZE_CLASSES = {
  sm: "h-9",
  md: "h-10 sm:h-16",
  lg: "h-14 sm:h-20",
};

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  withTagline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const height = INTRINSIC_HEIGHT[size];
  const width = Math.round(height * RATIO);

  return (
    <Image
      src="/logo.png"
      alt="Hohaya"
      width={width}
      height={height}
      priority
      className={cn("w-auto object-contain", SIZE_CLASSES[size], className)}
    />
  );
}
