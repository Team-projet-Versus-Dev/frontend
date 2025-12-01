// frontend/src/components/CreateVersusPage.tsx
import React, { useState } from "react";
import type { Versus } from "../types/versus";
import { searchAnime } from "../api/jikanApi";

type Props = {
  onBack: () => void;
  onSave: (versus: Versus) => void;
};

const CreateVersusPage: React.FC<Props> = ({ onBack, onSave }) => {
  const [category, setCategory] = useState("Animés");
  const [title, setTitle] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await searchAnime(search);
      setResults(data.data);
    } catch (e: any) {
      setError(e.message || "Erreur de recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFor = (side: "A" | "B", anime: any) => {
    if (side === "A") {
      setOptionA(anime.title);
    } else {
      setOptionB(anime.title);
    }
  };

  const handleSubmit = () => {
    if (!optionA || !optionB) return;

    const newVersus: Versus = {
      id: Date.now(), // temporaire côté front
      category,
      optionA: { text: optionA, votes: 0, percentage: 0 },
      optionB: { text: optionB, votes: 0, percentage: 0 },
      totalVotes: 0,
    };

    onSave(newVersus);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">
            ← Retour
          </button>
          <h1 className="text-lg font-semibold">Créer un questionnaire</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Infos de base */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la question (optionnel)
            </label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Quel héros préfères-tu ?"
            />
          </div>
        </section>

        {/* Recherche d'animés */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-sm">Choisir les personnages d'animé</h2>

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              placeholder="Naruto, One Piece..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md"
            >
              Rechercher
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-gray-500">Chargement...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-h-64 overflow-y-auto">
            {results.map((anime) => (
              <div
                key={anime.id}
                className="border rounded-md p-3 text-sm flex flex-col gap-2"
              >
                <div className="font-medium">{anime.title}</div>
                {anime.image && (
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleChooseFor("A", anime)}
                    className="flex-1 border rounded-md px-2 py-1 text-xs"
                  >
                    Choisir pour A
                  </button>
                  <button
                    onClick={() => handleChooseFor("B", anime)}
                    className="flex-1 border rounded-md px-2 py-1 text-xs"
                  >
                    Choisir pour B
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Récap / validation */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <h2 className="font-semibold text-gray-900 text-sm">Récapitulatif</h2>
          <p className="text-sm">
            A : <span className="font-medium">{optionA || "Non choisi"}</span>
          </p>
          <p className="text-sm">
            B : <span className="font-medium">{optionB || "Non choisi"}</span>
          </p>

          <button
            disabled={!optionA || !optionB}
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-md disabled:opacity-50"
          >
            Enregistrer le questionnaire
          </button>
        </section>
      </main>
    </div>
  );
};

export default CreateVersusPage;
