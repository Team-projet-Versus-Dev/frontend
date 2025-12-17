import React, { useState } from "react";
import { ArrowLeft, Users, Lock, Unlock, Key } from "lucide-react";
import type { Versus } from "../types/versus";
import { isAuthenticated, getDecryptionCode } from "../api/authApi";
import { decryptQuestionnaireTitle } from "../api/questionnaireApi";

type VersusDetailPageProps = {
  versus: Versus;
  onVote: (choice: "A" | "B") => void;
  onBack: () => void;
};

const VersusDetailPage: React.FC<VersusDetailPageProps> = ({ versus, onVote, onBack }) => {
  const userIsAuthenticated = isAuthenticated();
  const userDecryptionCode = getDecryptionCode();

  // État pour le déchiffrement
  const [inputCode, setInputCode] = useState("");
  const [decryptedTitle, setDecryptedTitle] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const isDecrypted = decryptedTitle !== null;
  const displayTitle = isDecrypted 
    ? decryptedTitle 
    : (versus.titleMasked || versus.title || '***');

  // Fonction pour déchiffrer
  const handleDecrypt = async () => {
    const code = inputCode.trim().toUpperCase();
    
    if (code.length !== 8) {
      setDecryptError('Le code doit faire 8 caractères');
      return;
    }

    setDecrypting(true);
    setDecryptError(null);

    try {
      const response = await decryptQuestionnaireTitle(versus.id, code);
      
      if (response.success && response.title) {
        setDecryptedTitle(response.title);
        setDecryptError(null);
      } else {
        setDecryptError(response.message || 'Échec du déchiffrement');
      }
    } catch (error) {
      setDecryptError('Erreur de communication avec le serveur');
    } finally {
      setDecrypting(false);
    }
  };

  // Auto-remplir avec le code de l'utilisateur
  const handleAutoFill = () => {
    if (userDecryptionCode) {
      setInputCode(userDecryptionCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm font-bold">
              VS
            </div>
            <span className="font-semibold text-lg">Versus</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Category */}
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-gray-600">{versus.category}</span>
        </div>

        {/* Titre avec indicateur de chiffrement */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
            {isDecrypted ? (
              <>
                <Unlock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-900">
                  {displayTitle}
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">
                  {displayTitle}
                </span>
                <span className="text-xs text-orange-500">(chiffré)</span>
              </>
            )}
          </div>
        </div>

        {/* Zone de déchiffrement - Toujours visible si pas encore déchiffré */}
        {!isDecrypted && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Déchiffrer le titre</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Entrez votre code de déchiffrement pour voir le titre complet.
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="CODE1234"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleDecrypt()}
                  className="flex-1 px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-black uppercase tracking-wider"
                />
                <button
                  onClick={handleDecrypt}
                  disabled={decrypting || inputCode.length !== 8}
                  className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {decrypting ? (
                    '...'
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      Déchiffrer
                    </>
                  )}
                </button>
              </div>

              {/* Bouton auto-remplir si connecté */}
              {userIsAuthenticated && userDecryptionCode && (
                <button
                  onClick={handleAutoFill}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  Utiliser mon code ({userDecryptionCode})
                </button>
              )}

              {/* Message d'erreur */}
              {decryptError && (
                <p className="mt-3 text-sm text-red-500">{decryptError}</p>
              )}
            </div>
          </div>
        )}

        {/* Message de succès */}
        {isDecrypted && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <Unlock className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-700">
                ✅ Titre déchiffré avec succès !
              </p>
            </div>
          </div>
        )}

        {/* Question */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-12">Tu préfères... ?</h1>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => onVote("A")}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-black hover:shadow-lg transition-all"
          >
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-6xl text-gray-300 font-bold">A</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 text-center">
              {versus.optionA.text}
            </div>
          </button>

          <button
            onClick={() => onVote("B")}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-black hover:shadow-lg transition-all"
          >
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-6xl text-gray-300 font-bold">B</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 text-center">
              {versus.optionB.text}
            </div>
          </button>
        </div>

        {/* Total votes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Total des votes</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {versus.totalVotes.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersusDetailPage;
