/**
 * API Jikan pour la recherche d'animés
 * Passe par le backend NestJS qui proxy vers l'API Jikan
 */

const API_URL = "http://localhost:3000/api";

export interface AnimeSearchResult {
  title: string;
  image: string | null;
  id?: number;
}

export interface SearchResponse {
  pagination: unknown;
  data: AnimeSearchResult[];
}

/**
 * Recherche d'animés par mot-clé
 * GET /api/jikan/search?q=...
 */
export async function searchAnime(query: string): Promise<SearchResponse> {
  const q = query.trim();
  
  if (!q) {
    // Évite de spammer l'API si l'utilisateur n'a rien tapé
    return { pagination: null, data: [] };
  }

  const res = await fetch(`${API_URL}/jikan/search?q=${encodeURIComponent(q)}`);

  if (!res.ok) {
    throw new Error("Erreur lors de la recherche");
  }

  return res.json();
}

/**
 * Récupération d'un animé par son ID
 * GET /api/jikan/:id
 */
export async function getAnimeById(id: number): Promise<AnimeSearchResult> {
  const res = await fetch(`${API_URL}/jikan/${id}`);

  if (!res.ok) {
    throw new Error("Erreur lors du chargement du détail");
  }

  return res.json();
}
