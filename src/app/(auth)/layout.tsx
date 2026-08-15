import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex justify-center">
          <Logo size="lg" withTagline />
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
