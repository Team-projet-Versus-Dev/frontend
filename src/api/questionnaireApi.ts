/**
 * API pour les questionnaires
 * 
 * Les titres sont chiffrés en base de données.
 * Pour voir un titre, il faut utiliser le CODE DE DÉCHIFFREMENT
 * reçu lors de la connexion.
 */

import { getAuthHeaders } from './authApi';

const API_BASE = "http://localhost:3000/api";

export type Questionnaire = {
  id: number;
  nom: string;           // Titre masqué (ex: "Na**********")
  nomChiffre?: string;   // Titre chiffré (données brutes)
  isEncrypted: boolean;
  userId: number;
  createdAt: string;
};

export type DecryptResponse = {
  success: boolean;
  title?: string;
  message: string;
};

/**
 * Récupère tous les questionnaires
 * Les titres sont MASQUÉS par défaut
 */
export async function getAllQuestionnaires(): Promise<Questionnaire[]> {
  const res = await fetch(`${API_BASE}/jeu`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des questionnaires");
  }

  return res.json();
}

/**
 * Récupère un questionnaire par son ID
 * Le titre est MASQUÉ par défaut
 */
export async function getQuestionnaireById(id: number): Promise<Questionnaire | null> {
  const res = await fetch(`${API_BASE}/jeu/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Erreur lors du chargement du questionnaire");
  }

  return res.json();
}

/**
 * Crée un nouveau questionnaire
 * Le titre sera CHIFFRÉ automatiquement côté serveur
 */
export async function createQuestionnaire(nom: string): Promise<Questionnaire> {
  const res = await fetch(`${API_BASE}/jeu`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ nom }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Erreur lors de la création du questionnaire");
  }

  return res.json();
}

/**
 * DÉCHIFFRE le titre d'un questionnaire avec un code
 * 
 * @param id - ID du questionnaire
 * @param code - Code de déchiffrement (8 caractères)
 * @returns Le titre déchiffré ou une erreur
 */
export async function decryptQuestionnaireTitle(
  id: number, 
  code: string
): Promise<DecryptResponse> {
  const res = await fetch(`${API_BASE}/jeu/${id}/decrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code.toUpperCase() }),
  });

  if (!res.ok) {
    return {
      success: false,
      message: "Erreur de communication avec le serveur",
    };
  }

  return res.json();
}

/**
 * Récupère les questionnaires d'un utilisateur
 */
export async function getQuestionnairesByUser(userId: number): Promise<Questionnaire[]> {
  const res = await fetch(`${API_BASE}/jeu/utilisateur/${userId}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des questionnaires");
  }

  return res.json();
}
