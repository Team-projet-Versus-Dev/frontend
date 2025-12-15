/**
 * API d'authentification
 * Gestion sécurisée des appels au backend pour login/signup
 */

export type AuthResponse = {
  user: {
    id: number;
    email: string;
    createdAt?: string;
  };
  accessToken: string;
};

// URL de base de l'API (avec le préfixe /api)
const API_BASE = "http://localhost:3000/api";

// --- Helpers sécurité/robustesse ---

/**
 * Normalise l'email (trim + lowercase)
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validation basique du format email
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Lecture sécurisée du JSON de réponse
 */
async function safeReadJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Extraction du message d'erreur depuis le corps de la réponse
 */
function extractErrorMessage(errorBody: unknown): string | null {
  if (typeof errorBody !== 'object' || errorBody === null) return null;
  
  const body = errorBody as Record<string, unknown>;
  const msg = body.message;
  
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.filter((x) => typeof x === "string").join(", ");
  if (typeof body.error === "string") return body.error;
  
  return null;
}

/**
 * Wrapper fetch avec timeout et gestion d'erreurs
 */
async function fetchJson<T>(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs = 10000, ...init } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    if (!res.ok) {
      const errorBody = await safeReadJson(res);
      const serverMsg = extractErrorMessage(errorBody);

      if (res.status === 400) throw new Error(serverMsg ?? "Requête invalide.");
      if (res.status === 401) throw new Error(serverMsg ?? "Email ou mot de passe incorrect.");
      if (res.status === 403) throw new Error(serverMsg ?? "Accès refusé.");
      if (res.status === 404) throw new Error(serverMsg ?? "Ressource introuvable.");
      if (res.status >= 500) throw new Error("Erreur serveur. Réessaie plus tard.");

      throw new Error(serverMsg ?? "Erreur réseau.");
    }

    return (await res.json()) as T;
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Le serveur met trop de temps à répondre (timeout).");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/signup
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = normalizeEmail(email);

  // Validation côté client (le backend valide aussi)
  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Email invalide.");
  }
  if (password.length < 8) {
    throw new Error("Mot de passe trop court (8 caractères minimum).");
  }

  return fetchJson<AuthResponse>(`${API_BASE}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
}

/**
 * Connexion d'un utilisateur existant
 * POST /api/auth/login
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Email invalide.");
  }
  if (!password) {
    throw new Error("Mot de passe requis.");
  }

  return fetchJson<AuthResponse>(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail, password }),
  });
}
