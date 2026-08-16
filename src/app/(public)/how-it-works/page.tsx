import {
  Search,
  KeyRound,
  Handshake,
  CreditCard,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  LockKeyhole,
  Headset,
  GraduationCap,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata = { title: "Comment ça marche" };

const PILIERS = [
  {
    icon: ShieldCheck,
    title: "Aucune arnaque",
    text: "Chaque annonce est vérifiée par notre équipe avant publication, et chaque propriétaire est contrôlé avant de pouvoir publier une maison.",
  },
  {
    icon: LockKeyhole,
    title: "Paiement protégé",
    text: "Le contact du propriétaire n'est débloqué qu'après un paiement Mobile Money sécurisé (dès 500 FCFA) — jamais avant, jamais par un autre canal.",
  },
  {
    icon: Headset,
    title: "Support réactif",
    text: "Une équipe locale joignable si un souci survient avec une annonce ou un propriétaire, ou si un signalement doit être traité.",
  },
  {
    icon: GraduationCap,
    title: "Pensé pour les étudiants",
    text: "Des maisons proches des écoles et universités, à des prix adaptés à un budget étudiant.",
  },
];

const STEPS_SEEKER = [
  {
    icon: Search,
    title: "Recherchez",
    text: "Parcourez les annonces vérifiées et filtrez par ville, quartier et budget pour trouver une maison près de votre école.",
  },
  {
    icon: KeyRound,
    title: "Débloquez le contact",
    text: "Une fois l'annonce qui vous intéresse trouvée, payez en Mobile Money (dès 500 FCFA) pour accéder directement aux coordonnées du propriétaire.",
  },
  {
    icon: Handshake,
    title: "Visitez et emménagez",
    text: "Convenez d'un rendez-vous de visite directement avec le propriétaire, puis finalisez la location avant votre rentrée.",
  },
];

const STEPS_OWNER = [
  {
    icon: CreditCard,
    title: "Souscrivez",
    text: "Choisissez la formule d'abonnement adaptée à vos besoins (mensuel à annuel) et payez en Mobile Money.",
  },
  {
    icon: Megaphone,
    title: "Publiez votre annonce",
    text: "Ajoutez photos, description, caractéristiques et indications d'accès. Notre équipe vérifie l'annonce avant publication.",
  },
  {
    icon: MessageCircle,
    title: "Recevez des demandes",
    text: "Les étudiants intéressés vous contactent ou demandent une visite. Vous gardez le contrôle sur qui vous répond.",
  },
];

function Timeline({ steps, accent }: { steps: typeof STEPS_SEEKER; accent: "primary" | "secondary" }) {
  const bg = accent === "primary" ? "bg-primary" : "bg-secondary";
  const text = accent === "primary" ? "text-primary" : "text-secondary";
  const bgSoft = accent === "primary" ? "bg-primary/10" : "bg-secondary/10";

  return (
    <ol className="relative space-y-8 border-l-2 border-border pl-8 sm:pl-10">
      {steps.map((s, i) => (
        <li key={s.title} className="relative">
          <span
            className={`absolute -left-[2.55rem] flex h-9 w-9 items-center justify-center rounded-full ${bg} text-sm font-bold text-white sm:-left-[3.05rem] sm:h-10 sm:w-10`}
          >
            {i + 1}
          </span>
          <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${bgSoft} ${text} mb-2`}>
            <s.icon size={16} />
          </div>
          <h3 className="font-heading font-semibold">{s.title}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function CommentCaMarchePage() {
  return (
    <div>
      {/* Hero — bandeau plein teal */}
      <section className="bg-secondary px-4 py-16 text-secondary-foreground sm:py-20">
        <div className="mx-auto max-w-[1440px] text-center">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">Comment fonctionne Hohaya</h1>
          <p className="mx-auto mt-3 max-w-xl text-secondary-foreground/85">
            Une plateforme pensée pour éliminer les intermédiaires douteux et les mauvaises surprises.
          </p>
        </div>
      </section>

      {/* 4 piliers de confiance */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILIERS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <p.icon size={22} />
                </div>
                <h2 className="font-heading font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process en timeline */}
      <section className="border-t border-border bg-muted/30 px-4 py-14">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 font-heading text-xl font-semibold text-primary">Vous êtes étudiant</h2>
            <Timeline steps={STEPS_SEEKER} accent="primary" />
            <div className="mt-6">
              <ButtonLink href="/listings">Voir les annonces</ButtonLink>
            </div>
          </div>

          <div>
            <h2 className="mb-6 font-heading text-xl font-semibold text-secondary">Vous êtes propriétaire</h2>
            <Timeline steps={STEPS_OWNER} accent="secondary" />
            <div className="mt-6">
              <ButtonLink href="/pricing" variant="outline">
                Voir les tarifs
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
