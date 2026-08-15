export type Role = "seeker" | "owner" | "admin";

export type User = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  adress: string | null;
  preferences: string | null;
  is_verified: boolean | null;
  is_suscribed: boolean | null;
  subscription_end: string | null;
  email_verified_at: string | null;
  roles?: string[];
  created_at: string;
};

export type PropertyMedia = {
  id: number;
  type?: "image" | "video";
  url: string;
  zone: string;
  zone_label?: string;
  is_principale?: boolean;
  ordre?: number;
  description?: string | null;
  duree_secondes?: number | null;
};

export type Property = {
  id: number;
  id_user?: number;
  title: string;
  description: string;
  indications_acces: string | null;
  quartier: string | null;
  commune: string | null;
  ville: string | null;
  pays: string | null;
  prix_loyer: number;
  devise: string;
  type_logement: string;
  condition: string | null;
  nb_avance: number;
  caution_electricite: number;
  caution_eau: number;
  nb_pieces: number;
  status: string;
  date_debut_louer: string | null;
  is_verified: boolean;
  eau_courante: boolean;
  electricite: boolean;
  gardien: boolean;
  parking: boolean;
  meuble: boolean;
  media_principal?: PropertyMedia | null;
  images?: PropertyMedia[];
  videos?: PropertyMedia[];
  total_medias?: number;
  proprietaire?: { id: number; name: string; phone: string | null } | null;
  created_at: string;
};

export type TarifAbonnement = {
  type: string;
  label: string;
  montant: number;
  devise: string;
  description: string | null;
};

export type AdminTarifAbonnement = {
  id: number;
  type: string;
  montant: number;
  devise: string;
  is_actif: boolean;
  description: string | null;
};

export type Abonnement = {
  id: number;
  type: string;
  type_label: string;
  status: string;
  montant: number;
  devise: string;
  date_debut: string | null;
  date_fin: string | null;
  jours_restants: number;
  est_actif: boolean;
  auto_renew: boolean | null;
  created_at: string;
};

export type Paiement = {
  id: number;
  type: string;
  status: string;
  montant: number;
  devise: string;
  kkiapay_transaction_id: string | null;
  telephone_paiement: string | null;
  operateur: string | null;
  paye_le: string | null;
  created_at: string;
  user?: { id: number; name: string; email: string | null } | null;
};

export type Favori = {
  id: number;
  property: Property | null;
  ajouté_le: string;
};

export type Visite = {
  id: number;
  status: string;
  date_souhaitee: string | null;
  message: string | null;
  note_proprietaire: string | null;
  property: { id: number; title: string; ville: string | null } | null;
  chercheur: { id: number; name: string; phone: string | null } | null;
  created_at: string;
};

export type AccessContact = {
  id: number;
  property: { id: number; title: string; ville: string | null; media_principal: { url: string } | null } | null;
  paiement: { montant: number; devise: string; paye_le: string | null } | null;
  debloque_le: string;
};

export type SupportTicket = {
  id: number;
  sujet: string;
  message: string;
  categorie: string;
  status: string;
  canal_preference: string | null;
  telephone_contact: string | null;
  reponse_admin: string | null;
  repondu_le: string | null;
  repondu_par: { id: number; name: string } | null;
  utilisateur?: { id: number; name: string; email: string | null } | null;
  created_at: string;
  updated_at: string;
};

export type Signalement = {
  id: number;
  motif: string;
  description: string | null;
  type_signalement: string;
  status: string;
  note_admin: string | null;
  traite_le: string | null;
  property: { id: number; title: string } | null;
  utilisateur: { id: number; name: string } | null;
  user_signale: { id: number; name: string } | null;
  created_at: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  roles: string[];
  is_verified: boolean;
  is_suscribed: boolean;
  deleted_at: string | null;
  created_at: string;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};
