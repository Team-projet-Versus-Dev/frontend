
import React from "react";

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple avec bouton retour */}
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
                value={"Utilisateur"}
                className="w-full rounded-lg bg-gray-100 p-2"
              />
            </div>
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <input
                disabled
                value={user.email}
                className="w-full rounded-lg bg-gray-100 p-2"
              />
            </div>
            <div>
              <p className="text-gray-500 mb-1">Date de naissance</p>
              <input
                disabled
                value="Non renseignée"
                className="w-full rounded-lg bg-gray-100 p-2"
              />
            </div>
            <div>
              <p className="text-gray-500 mb-1">Localisation</p>
              <input
                disabled
                value="Non renseignée"
                className="w-full rounded-lg bg-gray-100 p-2"
              />
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500 mb-1">Bio</p>
              <textarea
                disabled
                className="w-full rounded-lg bg-gray-100 p-2 min-h-[80px]"
              >
Aucune bio pour le moment...
              </textarea>
            </div>
          </div>
        </section>

        {/* Historique des votes */}
        <section className="bg-white shadow-sm rounded-2xl p-6 text-center text-gray-500 space-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Historique des votes</h3>
            <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5">0</span>
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              📈
            </div>
            <p>Aucun vote pour le moment</p>
            <p className="text-sm">
              Commence à voter pour voir ton historique ici
            </p>
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
