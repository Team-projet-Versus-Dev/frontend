// frontend/src/api/jikanApi.ts
export async function searchAnime(query: string) {
  const res = await fetch(
    `http://localhost:3000/jikan/search?q=${encodeURIComponent(query)}`
  );

  if (!res.ok) {
    throw new Error('Erreur lors de la recherche');
  }

  return res.json(); // { pagination, data: [{ id, title, image }] }
}

export async function getAnimeById(id: number) {
  const res = await fetch(`http://localhost:3000/jikan/${id}`);

  if (!res.ok) {
    throw new Error('Erreur lors du chargement du détail');
  }

  return res.json();
}
