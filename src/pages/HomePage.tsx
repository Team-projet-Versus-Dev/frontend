import React, { useState } from "react";
import { User, TrendingUp, LogIn, Lock, Unlock, Key } from "lucide-react";
import type { Versus } from "../types/versus";
import { isAuthenticated, getDecryptionCode } from "../api/authApi";
import { decryptQuestionnaireTitle } from "../api/questionnaireApi";

type HomePageProps = {
  versusItems: Versus[];
  onSelectVersus: (versus: Versus) => void;
  onCreateVersus: () => void;
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
  const [activeTab, setActiveTab] = useState<"populaire">("populaire");
  const isLoggedIn = Boolean(currentUserEmail);
  const userDecryptionCode = getDecryptionCode();

  // État pour les titres déchiffrés et les codes entrés
  const [decryptedTitles, setDecryptedTitles] = useState<Record<number, string>>({});
  const [inputCodes, setInputCodes] = useState<Record<number, string>>({});
  const [decryptErrors, setDecryptErrors] = useState<Record<number, string>>({});
  const [decrypting, setDecrypting] = useState<Record<number, boolean>>({});

  // Fonction pour déchiffrer un titre
  const handleDecrypt = async (itemId: number) => {
    const code = inputCodes[itemId] || '';
    
    if (code.length !== 8) {
      setDecryptErrors(prev => ({ ...prev, [itemId]: 'Le code doit faire 8 caractères' }));
      return;
    }

    setDecrypting(prev => ({ ...prev, [itemId]: true }));
    setDecryptErrors(prev => ({ ...prev, [itemId]: '' }));

    try {
      const response = await decryptQuestionnaireTitle(itemId, code);
      
      if (response.success && response.title) {
        setDecryptedTitles(prev => ({ ...prev, [itemId]: response.title! }));
      } else {
        setDecryptErrors(prev => ({ ...prev, [itemId]: response.message }));
      }
    } catch (error) {
      setDecryptErrors(prev => ({ ...prev, [itemId]: 'Erreur de déchiffrement' }));
    } finally {
      setDecrypting(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Auto-remplir avec le code de l'utilisateur
  const handleAutoFill = (itemId: number) => {
    if (userDecryptionCode) {
      setInputCodes(prev => ({ ...prev, [itemId]: userDecryptionCode }));
    }
  };

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

          {/* Affichage du code de déchiffrement si connecté */}
          {isLoggedIn && userDecryptionCode && (
            <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-green-50 border border-green-200">
              <Key className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="text-xs text-green-600 font-medium">Votre code de déchiffrement :</p>
                <p className="text-xl font-mono font-bold text-green-700 tracking-wider">
                  {userDecryptionCode}
                </p>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
              <Lock className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-600 font-medium">
                Connectez-vous pour obtenir votre code de déchiffrement
              </span>
            </div>
          )}

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
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm mb-4">
              Aucun questionnaire pour le moment.
            </p>
            <button
              onClick={onCreateVersus}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-900"
            >
              Créer le premier questionnaire
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {versusItems.map((item) => {
              const isDecrypted = !!decryptedTitles[item.id];
              const displayTitle = isDecrypted ? decryptedTitles[item.id] : (item.titleMasked || item.title || '***');
              
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Catégorie */}
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    {item.category}
                  </div>

                  {/* Titre avec statut de chiffrement */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {isDecrypted ? (
                        <Unlock className="w-4 h-4 text-green-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-orange-500" />
                      )}
                      <span className={`font-semibold ${isDecrypted ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {displayTitle}
                      </span>
                    </div>

                    {/* Champ de déchiffrement */}
                    {!isDecrypted && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <label className="block text-xs text-gray-500 mb-1">
                          Entrez le code pour déchiffrer le titre :
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={8}
                            placeholder="CODE1234"
                            value={inputCodes[item.id] || ''}
                            onChange={(e) => setInputCodes(prev => ({ 
                              ...prev, 
                              [item.id]: e.target.value.toUpperCase() 
                            }))}
                            className="flex-1 px-2 py-1 text-sm font-mono border rounded focus:outline-none focus:ring-2 focus:ring-black uppercase"
                          />
                          <button
                            onClick={() => handleDecrypt(item.id)}
                            disabled={decrypting[item.id]}
                            className="px-3 py-1 text-xs font-medium bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                          >
                            {decrypting[item.id] ? '...' : '🔓'}
                          </button>
                        </div>
                        
                        {/* Bouton auto-remplir si connecté */}
                        {userDecryptionCode && (
                          <button
                            onClick={() => handleAutoFill(item.id)}
                            className="mt-2 text-xs text-blue-600 hover:underline"
                          >
                            Utiliser mon code ({userDecryptionCode})
                          </button>
                        )}
                        
                        {/* Message d'erreur */}
                        {decryptErrors[item.id] && (
                          <p className="mt-1 text-xs text-red-500">{decryptErrors[item.id]}</p>
                        )}
                      </div>
                    )}

                    {/* Message de succès */}
                    {isDecrypted && (
                      <p className="text-xs text-green-600 mt-1">✅ Titre déchiffré !</p>
                    )}
                  </div>

                  {/* Options VS - Toujours visibles */}
                  <button
                    onClick={() => onSelectVersus(item)}
                    className="w-full text-left"
                  >
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
