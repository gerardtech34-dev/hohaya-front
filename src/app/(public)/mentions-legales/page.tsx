export const metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold">Mentions légales</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Éditeur du site</h2>
          <p>Hohaya — Plateforme de mise en relation immobilière. Cotonou, Bénin. Contact : contact@hohaya.com</p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Objet</h2>
          <p>
            Hohaya met en relation des chercheurs de logement et des propriétaires. Hohaya n&apos;est
            pas partie aux contrats de location conclus entre utilisateurs et n&apos;intervient pas
            comme agence immobilière.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Responsabilité</h2>
          <p>
            Les annonces publiées sont vérifiées par nos équipes avant mise en ligne, mais Hohaya ne
            garantit pas l&apos;exactitude de toutes les informations fournies par les propriétaires.
            Tout signalement d&apos;annonce suspecte peut être effectué directement depuis la plateforme.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des éléments visuels et textuels du site Hohaya (logo, charte graphique,
            contenus) est protégé et ne peut être reproduit sans autorisation.
          </p>
        </section>
      </div>
    </div>
  );
}
