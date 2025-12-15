import React, { useState } from "react";
import { User, TrendingUp, LogIn } from "lucide-react";
import type { Versus } from "../types/versus";

type HomePageProps = {
  versusItems: Versus[];
  onSelectVersus: (versus: Versus) => void;
  onCreateVersus: () => void;

  // ✅ ajoutés pour matcher App.tsx
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  currentUserEmail?: string;
};

const HomePage: React.FC<HomePageProps> = ({
  versusItems,
  onSelectVersus,
  onCreateVersus,
  onOpenLogin,
  onOpenProfile,
  currentUserEmail,
}) => {
  const [activeTab, setActiveTab] = useState<"populaire">(
    "populaire"
  );

  const isLoggedIn = Boolean(currentUserEmail);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm font-bold">
              VS
            </div>
            <span className="font-semibold text-lg">Versus</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCreateVersus}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-900"
              type="button"
            >
              Créer un questionnaire
            </button>

            {/* ✅ bouton login/profil selon auth */}
            {!isLoggedIn ? (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                type="button"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-sm">Se connecter</span>
              </button>
            ) : (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                type="button"
                title={currentUserEmail}
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Profil</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu préfères... ?</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fais tes choix et découvre ce que les autres préfèrent. Participe aux débats
            et crée tes propres questions.
          </p>

          <div className="flex justify-center gap-12 mt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Total votes</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">15 234</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Questions actives</div>
              <div className="text-2xl font-bold text-gray-900">324</div>
            </div>
          </div>

          {isLoggedIn && (
            <p className="mt-4 text-xs text-gray-500">
              Connecté en tant que <span className="font-medium">{currentUserEmail}</span>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("populaire")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "populaire"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              type="button"
            >
              Populaire
            </button>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Questions populaires</h2>

        {versusItems.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Aucun questionnaire pour le moment. Clique sur &quot;Créer un questionnaire&quot; pour en ajouter un.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {versusItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectVersus(item)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-left"
                type="button"
              >
                <div className="text-xs font-medium text-gray-500 mb-4">
                  {item.category}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">
                        {item.optionA.text}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {item.optionA.percentage ?? 0}%
                      </span>
                    </div>
                    <div className="text-center py-2 text-gray-400 text-sm">
                      VS
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">
                        {item.optionB.text}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {item.optionB.percentage ?? 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {(item.totalVotes ?? 0).toLocaleString()} votes
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
