import { Search, KeyRound, Handshake, CreditCard, Megaphone, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata = { title: "Comment ça marche" };

const STEPS_SEEKER = [
  {
    icon: Search,
    title: "1. Recherchez",
    text: "Parcourez les annonces vérifiées et filtrez par ville, quartier, type de logement et budget.",
  },
  {
    icon: KeyRound,
    title: "2. Débloquez le contact",
    text: "Une fois l'annonce qui vous intéresse trouvée, payez en Mobile Money pour accéder directement aux coordonnées du propriétaire.",
  },
  {
    icon: Handshake,
    title: "3. Visitez et emménagez",
    text: "Convenez d'un rendez-vous de visite directement avec le propriétaire, puis finalisez la location.",
  },
];

const STEPS_OWNER = [
  {
    icon: CreditCard,
    title: "1. Souscrivez",
    text: "Choisissez la formule d'abonnement adaptée à vos besoins (mensuel à annuel) et payez en Mobile Money.",
  },
  {
    icon: Megaphone,
    title: "2. Publiez votre annonce",
    text: "Ajoutez photos, description, caractéristiques et indications d'accès. Notre équipe vérifie l'annonce avant publication.",
  },
  {
    icon: MessageCircle,
    title: "3. Recevez des demandes",
    text: "Les chercheurs intéressés vous contactent ou demandent une visite. Vous gardez le contrôle sur qui vous répond.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Comment ça marche</h1>
        <p className="mt-3 text-muted-foreground">
          Deux parcours simples : que vous soyez étudiant à la recherche d&apos;une maison, ou
          propriétaire souhaitant en louer une.
        </p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="mb-5 font-heading text-xl font-semibold text-primary">Vous êtes étudiant</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS_SEEKER.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <s.icon size={20} />
                </div>
                <h3 className="font-heading font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <ButtonLink href="/annonces">Voir les annonces</ButtonLink>
          </div>
        </div>

        <div>
          <h2 className="mb-5 font-heading text-xl font-semibold text-secondary">Vous êtes propriétaire</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS_OWNER.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <s.icon size={20} />
                </div>
                <h3 className="font-heading font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <ButtonLink href="/tarifs" variant="outline">
              Voir les tarifs
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
