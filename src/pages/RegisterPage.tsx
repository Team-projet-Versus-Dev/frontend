import React, { useMemo, useState } from "react";
import { register } from "../api/authApi";
import type { AuthResponse } from "../api/authApi";

type RegisterPageProps = {
  onBack: () => void;
  onRegisterSuccess: (auth: AuthResponse) => void;
  onGoToLogin: () => void;
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

function passwordStrengthErrors(pw: string): string[] {
  const errs: string[] = [];
  if (pw.length < 8) errs.push("8 caractères minimum");
  if (!/[A-Z]/.test(pw)) errs.push("1 majuscule");
  if (!/[a-z]/.test(pw)) errs.push("1 minuscule");
  if (!/[0-9]/.test(pw)) errs.push("1 chiffre");
  if (!/[^A-Za-z0-9]/.test(pw)) errs.push("1 caractère spécial");
  return errs;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onRegisterSuccess, onGoToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  const pwErrors = useMemo(() => passwordStrengthErrors(password), [password]);

  const canSubmit = useMemo(() => {
    return (
      isValidEmail(normalizedEmail) &&
      pwErrors.length === 0 &&
      password === passwordConfirm &&
      !isSubmitting
    );
  }, [normalizedEmail, pwErrors.length, password, passwordConfirm, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(normalizedEmail)) {
      setError("Email invalide.");
      return;
    }

    if (pwErrors.length > 0) {
      setError(`Mot de passe trop faible : ${pwErrors.join(", ")}.`);
      return;
    }

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = await register(normalizedEmail, password);
      onRegisterSuccess(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h1>
        <p className="text-sm text-gray-600 mb-6">
          Inscris-toi pour sauvegarder tes votes et créer des questionnaires.
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
              <p className="mt-1 text-xs text-red-600">Format d’email invalide.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="flex gap-2">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                placeholder="Mot de passe fort"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-600">
              {pwErrors.length === 0 ? (
                <span className="text-green-700">Mot de passe OK ✅</span>
              ) : (
                <span>Requis : {pwErrors.join(" • ")}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation du mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              placeholder="••••••••"
            />
            {passwordConfirm.length > 0 && password !== passwordConfirm && (
              <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full mt-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-600 text-center">
          Tu as déjà un compte ?{" "}
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-black font-medium hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
