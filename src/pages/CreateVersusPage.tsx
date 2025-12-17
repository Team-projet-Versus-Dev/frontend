// frontend/src/pages/CreateVersusPage.tsx
import React, { useState } from "react";
import { Lock, Shield } from "lucide-react";
import type { Versus } from "../types/versus";
import { searchAnime } from "../api/jikanApi";
import { isAuthenticated, getAuthHeaders } from "../api/authApi";

type Props = {
  onBack: () => void;
  onSave: (versus: Versus) => void;
};

const API_BASE = "http://localhost:3000/api";

const CreateVersusPage: React.FC<Props> = ({ onBack, onSave }) => {
  const [category, setCategory] = useState("Animés");
  const [title, setTitle] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const userIsAuthenticated = isAuthenticated();

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

  const handleSubmit = async () => {
    if (!optionA || !optionB || !userIsAuthenticated) return;

    setSaving(true);
    setError(null);

    try {
      // Appeler l'API pour créer le questionnaire
      const res = await fetch(`${API_BASE}/jeu`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nom: title || `${optionA} vs ${optionB}` }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la création");
      }

      const data = await res.json();

      // Créer l'objet Versus avec le titre MASQUÉ (pas en clair !)
      const newVersus: Versus = {
        id: data.id,
        category,
        title: data.nomMasque,        // Utiliser le titre MASQUÉ
        titleMasked: data.nomMasque,  // Titre masqué
        isEncrypted: true,            // Toujours chiffré
        optionA: { text: optionA, votes: 0, percentage: 0 },
        optionB: { text: optionB, votes: 0, percentage: 0 },
        totalVotes: 0,
      };

      onSave(newVersus);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la création");
    } finally {
      setSaving(false);
    }
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
        {/* Alerte sécurité */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">🔐 Chiffrement AES-256</h3>
            <p className="text-sm text-green-700 mt-1">
              Le titre de votre questionnaire sera <strong>chiffré</strong> dans la base de données.
              Seuls les utilisateurs avec le code pourront le déchiffrer.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

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
              <span className="flex items-center gap-2">
                Titre de la question
                <Lock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-normal text-orange-500">(sera chiffré)</span>
              </span>
            </label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Quel héros préfères-tu ?"
            />
            <p className="mt-1 text-xs text-gray-500">
              Ce titre sera stocké de manière chiffrée (AES-256-GCM) et ne sera visible 
              qu'avec le code de déchiffrement.
            </p>
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md"
            >
              Rechercher
            </button>
          </div>

          {loading && <p className="text-sm text-gray-500">Chargement...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-h-64 overflow-y-auto">
            {results.map((anime, index) => (
              <div
                key={`${anime.title}-${index}`}
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
                    className={`flex-1 border rounded-md px-2 py-1 text-xs ${
                      optionA === anime.title ? 'bg-black text-white' : ''
                    }`}
                  >
                    Choisir pour A
                  </button>
                  <button
                    onClick={() => handleChooseFor("B", anime)}
                    className={`flex-1 border rounded-md px-2 py-1 text-xs ${
                      optionB === anime.title ? 'bg-black text-white' : ''
                    }`}
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
          
          <div className="bg-gray-50 rounded-md p-3 space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Titre :</span>{" "}
              <span className="font-medium">{title || `${optionA || '?'} vs ${optionB || '?'}`}</span>
              <Lock className="inline w-3 h-3 ml-1 text-orange-500" />
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Option A :</span>{" "}
              <span className="font-medium">{optionA || "Non choisi"}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Option B :</span>{" "}
              <span className="font-medium">{optionB || "Non choisi"}</span>
            </p>
          </div>

          {!userIsAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
              ⚠️ Vous devez être connecté pour créer un questionnaire.
            </div>
          )}

          <button
            disabled={!optionA || !optionB || !userIsAuthenticated || saving}
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-md disabled:opacity-50 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {saving ? "Création en cours..." : "Enregistrer (titre chiffré)"}
          </button>
        </section>
      </main>
    </div>
  );
};

export default CreateVersusPage;
