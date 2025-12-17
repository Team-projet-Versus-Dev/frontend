import React, { useState } from "react";
import { Key, Copy, Check } from "lucide-react";
import { getDecryptionCode } from "../api/authApi";

type ProfilePageProps = {
  user: {
    email: string;
    createdAt?: string;
  };
  onBack: () => void;
  onLogout: () => void;
};

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "non renseigné";
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBack, onLogout }) => {
  const decryptionCode = getDecryptionCode();
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    if (decryptionCode) {
      navigator.clipboard.writeText(decryptionCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-full p-2 hover:bg-gray-100 transition"
            aria-label="Retour"
          >
            ←
          </button>
          <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
            VS
          </span>
          <h1 className="text-lg font-semibold">Mon Profil</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Carte identité + stats */}
        <section className="bg-white shadow-sm rounded-2xl p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className="font-semibold text-xl">Utilisateur</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                Membre depuis {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex justify-around md:justify-end gap-8 text-center">
            <div>
              <p className="text-xl font-bold">0</p>
              <p className="text-gray-500 text-sm">Votes</p>
            </div>
            <div>
              <p className="text-xl font-bold">0</p>
              <p className="text-gray-500 text-sm">Questions</p>
            </div>
            <div>
              <p className="text-xl font-bold">0</p>
              <p className="text-gray-500 text-sm">Commentaires</p>
            </div>
          </div>
        </section>

        {/* CODE DE DÉCHIFFREMENT */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Key className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-1">
                🔐 Votre code de déchiffrement
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Utilisez ce code pour déchiffrer les titres des questionnaires sur la page d'accueil.
              </p>
              
              <div className="bg-white rounded-xl p-4 inline-flex items-center gap-4">
                <span className="text-2xl font-mono font-bold text-gray-900 tracking-widest">
                  {decryptionCode || "N/A"}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Copier le code"
                >
                  {codeCopied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
              
              {codeCopied && (
                <p className="text-xs text-green-600 mt-2">✓ Code copié dans le presse-papiers !</p>
              )}
            </div>
          </div>
        </section>

        {/* Explication du chiffrement */}
        <section className="bg-white shadow-sm rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">🔒 Comment fonctionne le chiffrement ?</h3>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">1</span>
              <p>Les titres des questionnaires sont <strong>chiffrés avec AES-256-GCM</strong> dans la base de données.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">2</span>
              <p>Sans le code, les titres apparaissent <strong>masqués</strong> (ex: "Na**********").</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">3</span>
              <p>En entrant votre code, le titre est <strong>déchiffré</strong> et devient visible.</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <strong>💡 Astuce :</strong> Sur la page d'accueil, cliquez sur "Utiliser mon code" 
            pour remplir automatiquement le champ de déchiffrement.
          </div>
        </section>

        {/* Informations personnelles */}
        <section className="bg-white shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            <button className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
              Modifier
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Nom d'utilisateur</p>
              <input
                disabled
                defaultValue="Utilisateur"
                className="w-full rounded-lg bg-gray-100 p-2"
              />
            </div>
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <input
                disabled
                defaultValue={user.email}
                className="w-full rounded-lg bg-gray-100 p-2"
              />
            </div>
          </div>
        </section>

        {/* Paramètres du compte */}
        <section className="bg-white shadow-sm rounded-2xl p-6 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Paramètres du compte</h3>

          <button className="w-full text-left border-b border-gray-100 py-3 text-sm">
            Changer le mot de passe
          </button>
          <button className="w-full text-left border-b border-gray-100 py-3 text-sm">
            Préférences de notification
          </button>
          <button className="w-full text-left border-b border-gray-100 py-3 text-sm">
            Confidentialité
          </button>

          <button className="w-full text-left py-3 text-sm text-red-600">
            Supprimer mon compte
          </button>
        </section>

        {/* Déconnexion */}
        <section className="text-center">
          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50"
          >
            Se déconnecter
          </button>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
