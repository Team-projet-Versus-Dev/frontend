import React, { useMemo, useState } from "react";
import { Key, Copy, Check } from "lucide-react";
import { login } from "../api/authApi";
import type { AuthResponse } from "../api/authApi";

type LoginPageProps = {
  onBack: () => void;
  onLoginSuccess: (auth: AuthResponse) => void;
  onGoToRegister: () => void;
};

function safeText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess, onGoToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // État pour afficher le code après connexion
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [decryptionCode, setDecryptionCode] = useState<string | null>(null);
  const [authData, setAuthData] = useState<AuthResponse | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  const canSubmit = useMemo(() => {
    return isValidEmail(normalizedEmail) && password.length > 0 && !isSubmitting;
  }, [normalizedEmail, password, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const auth = await login(normalizedEmail, password);
      
      // Stocker les données et afficher le modal avec le code
      setAuthData(auth);
      setDecryptionCode(auth.decryptionCode);
      setShowCodeModal(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (decryptionCode) {
      navigator.clipboard.writeText(decryptionCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    if (authData) {
      onLoginSuccess(authData);
    }
  };

  // Modal d'affichage du code
  if (showCodeModal && decryptionCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion réussie ! 🎉
            </h1>
            
            <p className="text-gray-600 mb-6">
              Voici votre <strong>code de déchiffrement</strong> pour voir les titres des questionnaires :
            </p>

            {/* Code de déchiffrement */}
            <div className="bg-gray-100 rounded-xl p-6 mb-6">
              <p className="text-xs text-gray-500 mb-2">Votre code unique :</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-mono font-bold text-gray-900 tracking-widest">
                  {decryptionCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
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
                <p className="text-xs text-green-600 mt-2">Code copié !</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important :</strong> Conservez ce code ! 
                Il vous permet de déchiffrer les titres des questionnaires.
                Vous pouvez le retrouver sur votre page de profil.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full px-4 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900"
            >
              Continuer vers l'application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          ← Retour
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
        <p className="text-sm text-gray-600 mb-6">
          Connecte-toi pour obtenir ton <strong>code de déchiffrement</strong> et voir les titres des questionnaires.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {safeText(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              placeholder="toi@example.com"
            />
            {email.length > 0 && !isValidEmail(normalizedEmail) && (
              <p className="mt-1 text-xs text-red-600">Format d'email invalide.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="flex gap-2">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full mt-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            {isSubmitting ? "Connexion..." : "Se connecter et obtenir mon code"}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-600 text-center">
          Pas encore de compte ?{" "}
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-black font-medium hover:underline"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
