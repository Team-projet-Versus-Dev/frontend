export type VersusOption = {
  text: string;
  votes: number;
  percentage: number;
};

export type Versus = {
  id: number;
  category: string;
  title?: string;        // Titre du questionnaire (déchiffré si connecté)
  titleMasked?: string;  // Titre masqué (si non connecté)
  isEncrypted?: boolean; // true si le titre est masqué
  optionA: VersusOption;
  optionB: VersusOption;
  totalVotes: number;
};

// Type pour les questionnaires de l'API
export type Questionnaire = {
  id: number;
  nom: string;           // Titre (déchiffré ou masqué selon auth)
  nomMasque?: string;    // Titre masqué
  isEncrypted: boolean;  // true si l'utilisateur n'est pas connecté
  userId: number;
  createdAt: string;
};
