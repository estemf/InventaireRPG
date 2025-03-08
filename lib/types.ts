// Interface Item correspondant à notre modèle Prisma
export interface Item {
  id: number;
  name: string;
  type: string;
  rarity: string;
  description?: string;
  quantity: number;
}

// Types mis à jour pour correspondre au schéma Prisma
export const itemTypes = [
  "arme",
  "armure",
  "potion",
  "parchemin",
  "ingrédient",
  "quête",
  "divers"
] as const;

// Types de rareté disponibles
export const rarities = [
  "commun",
  "rare",
  "épique",
  "légendaire"
] as const;

// Type pour le formulaire de création d'items
export interface ItemFormInput {
  name: string;
  type: string;
  rarity: string;
  description?: string;
  quantity: number;
}