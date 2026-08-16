import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = { title: "FAQ" };

const FAQ_CHERCHEUR = [
  {
    q: "Comment débloquer le contact d'un propriétaire ?",
    a: "Depuis la page d'une annonce vérifiée, cliquez sur « Débloquer le contact du propriétaire » puis réglez le montant indiqué via Mobile Money (KKiaPay). Vous obtenez immédiatement le nom et le numéro de téléphone du propriétaire.",
  },
  {
    q: "Le paiement est-il sécurisé ?",
    a: "Oui, tous les paiements passent par KKiaPay, une passerelle de paiement Mobile Money sécurisée. Hohaya ne stocke jamais vos informations de paiement.",
  },
  {
    q: "Que faire si une annonce me semble suspecte ?",
    a: "Utilisez le bouton de signalement sur la page de l'annonce, ou contactez le support depuis votre espace. Notre équipe examine chaque signalement sous 48h.",
  },
];

const FAQ_PROPRIETAIRE = [
  {
    q: "Comment publier une annonce ?",
    a: "Créez un compte propriétaire, souscrivez à un abonnement (voir la page Tarifs), puis publiez votre annonce avec photos et caractéristiques. Elle sera vérifiée par notre équipe avant d'être visible publiquement.",
  },
  {
    q: "Combien de temps prend la vérification d'une annonce ?",
    a: "En général sous 24 à 48h ouvrées après publication.",
  },
  {
    q: "Puis-je changer de formule d'abonnement ?",
    a: "Oui, vous pouvez souscrire à une nouvelle formule à tout moment depuis votre espace « Abonnement ».",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Questions fréquentes</h1>
        <p className="mt-3 text-muted-foreground">
          Vous ne trouvez pas votre réponse ?{" "}
          <Link href="mailto:contact@hohaya.com" className="text-primary underline-offset-4 hover:underline">
            Contactez-nous
          </Link>
          .
        </p>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="mb-2 font-heading text-lg font-semibold text-primary">Pour les chercheurs</h2>
          <Accordion>
            {FAQ_CHERCHEUR.map((item, i) => (
              <AccordionItem key={i} value={`chercheur-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <h2 className="mb-2 font-heading text-lg font-semibold text-secondary">Pour les propriétaires</h2>
          <Accordion>
            {FAQ_PROPRIETAIRE.map((item, i) => (
              <AccordionItem key={i} value={`proprietaire-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
