/**
 * API d'authentification
 * 
 * À la connexion/inscription, l'utilisateur reçoit :
 * - Un token JWT (pour l'authentification)
 * - Un CODE DE DÉCHIFFREMENT (pour voir les titres des questionnaires)
 */

export type AuthResponse = {
  user: {
    id: number;
    email: string;
    createdAt?: string;
  };
  accessToken: string;
  decryptionCode: string;  // ← Le code pour déchiffrer les titres !
};

const API_BASE = "http://localhost:3000/api";

// Stockage du token et du code
let authToken: string | null = null;
let decryptionCode: string | null = null;

/**
 * Définit le token d'authentification
 */
export function setAuthToken(token: string | null): void {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

/**
 * Définit le code de déchiffrement
 */
export function setDecryptionCode(code: string | null): void {
  decryptionCode = code;
  if (code) {
    localStorage.setItem('decryptionCode', code);
  } else {
    localStorage.removeItem('decryptionCode');
  }
}

/**
 * Récupère le token d'authentification
 */
export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
}

/**
 * Récupère le code de déchiffrement
 */
export function getDecryptionCode(): string | null {
  if (!decryptionCode) {
    decryptionCode = localStorage.getItem('decryptionCode');
  }
  return decryptionCode;
}

/**
 * Vérifie si l'utilisateur est connecté
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Retourne les headers avec le token si connecté
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// --- Helpers ---

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function safeReadJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(errorBody: unknown): string | null {
  if (typeof errorBody !== 'object' || errorBody === null) return null;
  
  const body = errorBody as Record<string, unknown>;
  const msg = body.message;
  
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.filter((x) => typeof x === "string").join(", ");
  if (typeof body.error === "string") return body.error;
  
  return null;
}

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
      headers: {
        ...getAuthHeaders(),
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
 * Retourne le token ET le code de déchiffrement
 */
export async function register(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Email invalide.");
  }
  if (password.length < 8) {
    throw new Error("Mot de passe trop court (8 caractères minimum).");
  }

  const response = await fetchJson<AuthResponse>(`${API_BASE}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail, password }),
  });

  // Stocker le token ET le code de déchiffrement
  setAuthToken(response.accessToken);
  setDecryptionCode(response.decryptionCode);
  
  return response;
}

/**
 * Connexion d'un utilisateur existant
 * Retourne le token ET le code de déchiffrement
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Email invalide.");
  }
  if (!password) {
    throw new Error("Mot de passe requis.");
  }

  const response = await fetchJson<AuthResponse>(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail, password }),
  });

  // Stocker le token ET le code de déchiffrement
  setAuthToken(response.accessToken);
  setDecryptionCode(response.decryptionCode);
  
  return response;
}

/**
 * Déconnexion - Efface le token et le code
 */
export function logout(): void {
  setAuthToken(null);
  setDecryptionCode(null);
}
