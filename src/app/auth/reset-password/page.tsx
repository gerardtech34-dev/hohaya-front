import { redirect } from "next/navigation";

export default async function LegacyResetPasswordRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams(params).toString();
  redirect(`/reset-password${qs ? `?${qs}` : ""}`);
}
