export function formatPrix(prix: number, devise = "XOF") {
  const label = devise === "XOF" ? "FCFA" : devise;
  return new Intl.NumberFormat("fr-FR").format(prix) + " " + label;
}
