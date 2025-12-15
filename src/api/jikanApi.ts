// frontend/src/api/jikanApi.ts

const API_URL = "http://localhost:3000/api";

export async function searchAnime(query: string) {
  const q = query.trim();
  if (!q) {
    // on évite de spammer l'API si l'utilisateur n'a rien tapé
    return { pagination: null, data: [] };
  }

  const res = await fetch(`${API_URL}/jikan/search?q=${encodeURIComponent(q)}`);

  if (!res.ok) {
    throw new Error("Erreur lors de la recherche");
  }

  // attendu: { pagination, data: [{ id, title, image }] }
  return res.json();
}

export async function getAnimeById(id: number) {
  const res = await fetch(`${API_URL}/jikan/${id}`);

  if (!res.ok) {
    throw new Error("Erreur lors du chargement du détail");
  }

  return res.json();
}
