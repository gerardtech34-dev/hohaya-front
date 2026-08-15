import { ShieldCheck, GraduationCap, Wallet } from "lucide-react";

export const metadata = { title: "À propos" };

const VALEURS = [
  {
    icon: ShieldCheck,
    title: "Confiance",
    text: "Chaque annonce est vérifiée par notre équipe avant publication, et chaque propriétaire est contrôlé avant de pouvoir publier.",
  },
  {
    icon: GraduationCap,
    title: "Pensé pour les étudiants",
    text: "Des maisons à des prix adaptés à un budget d'étudiant, proches des écoles et universités, sans intermédiaire à commission.",
  },
  {
    icon: Wallet,
    title: "Paiement accessible",
    text: "Débloquer le contact d'un propriétaire coûte quelques centaines de francs, payables en Mobile Money, sans frais cachés.",
  },
];

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">À propos de Hohaya</h1>
        <p className="mt-3 text-muted-foreground">
          Hohaya est la plateforme qui aide les étudiants au Bénin à trouver une maison à louer en
          toute confiance, et les propriétaires à la louer sans intermédiaire.
        </p>
      </div>

      <div className="space-y-4 leading-relaxed text-muted-foreground">
        <p>
          Chaque rentrée, trouver un logement quand on est étudiant relève souvent du parcours du
          combattant : bouche-à-oreille, démarcheurs peu fiables, annonces douteuses. Hohaya est né
          pour changer ça — une plateforme pensée pour les étudiants, où chaque maison est vérifiée
          et chaque propriétaire contrôlé avant de pouvoir publier.
        </p>
        <p>
          Que vous cherchiez une maison proche de votre école à Cotonou, Porto-Novo ou ailleurs,
          Hohaya vous permet de filtrer les annonces, comparer les prix et contacter directement le
          propriétaire — pour quelques centaines de francs, payables en Mobile Money.
        </p>
        <p>
          Pour l&apos;instant, nous nous concentrons volontairement sur les maisons à louer, pour
          bien faire une seule chose avant d&apos;élargir à d&apos;autres types de logement.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {VALEURS.map((v) => (
          <div key={v.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <v.icon size={20} />
            </div>
            <h2 className="font-heading font-semibold">{v.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
