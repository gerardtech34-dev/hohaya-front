export const metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <h1 className="mb-8 font-heading text-3xl font-bold">Politique de confidentialité</h1>
      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Données collectées</h2>
          <p>
            Lors de votre inscription, nous collectons votre nom, email et/ou numéro de téléphone,
            et mot de passe (stocké chiffré). Les propriétaires renseignent en plus une adresse et
            des informations sur leurs annonces.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Utilisation des données</h2>
          <p>
            Vos données servent uniquement au fonctionnement de la plateforme : authentification,
            mise en relation avec les propriétaires après paiement, gestion des visites et du
            support. Elles ne sont jamais vendues à des tiers.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Paiement</h2>
          <p>
            Les paiements sont traités par KKiaPay. Hohaya ne stocke aucune donnée bancaire ou
            Mobile Money — seules les références de transaction sont conservées pour le suivi des
            paiements.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-heading font-semibold text-foreground">Vos droits</h2>
          <p>
            Vous pouvez à tout moment modifier vos informations depuis votre profil, ou demander la
            suppression de votre compte. La suppression entraîne l&apos;anonymisation de vos données
            personnelles.
          </p>
        </section>
      </div>
    </div>
  );
}
