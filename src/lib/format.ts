export function formatPrix(prix: number, devise = "XOF") {
  return new Intl.NumberFormat("fr-FR").format(prix) + " " + devise;
}
