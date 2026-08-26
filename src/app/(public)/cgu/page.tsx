export const metadata = { title: "Conditions d'utilisation" };

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold">Conditions générales d&apos;utilisation</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">1. Inscription</h2>
          <p>
            L&apos;utilisation de Hohaya nécessite la création d&apos;un compte chercheur ou
            propriétaire. Les informations fournies doivent être exactes ; tout compte suspecté de
            fraude peut être suspendu.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">2. Publication d&apos;annonces</h2>
          <p>
            Les propriétaires garantissent l&apos;exactitude des informations publiées (description,
            photos, prix, disponibilité). Toute annonce jugée trompeuse peut être suspendue par
            notre équipe de modération, avec ou sans préavis.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">3. Paiements et abonnements</h2>
          <p>
            La publication d&apos;annonces nécessite un abonnement actif. Le déblocage du contact
            d&apos;un propriétaire par un chercheur est un service payant, réglé via FedaPay. Les
            paiements confirmés ne sont pas remboursables, sauf erreur technique avérée.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">4. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis votre profil. Hohaya se réserve
            le droit de suspendre un compte en cas de non-respect des présentes conditions.
          </p>
        </section>
      </div>
    </div>
  );
}
