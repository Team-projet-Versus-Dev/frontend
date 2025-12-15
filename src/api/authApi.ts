export type AuthResponse = {
  user: {
    id: number;
    email: string;
    createdAt?: string;
  };
  accessToken: string;
};

const API_BASE = "http://localhost:3000";

// --- Helpers sécurité/robustesse ---
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  // simple + efficace (évite regex trop permissive)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function safeReadJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(errorBody: any): string | null {
  // Nest peut renvoyer message: string | string[]
  const msg = errorBody?.message;
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.filter((x) => typeof x === "string").join(", ");
  if (typeof errorBody?.error === "string") return errorBody.error;
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
      // sécurité/robustesse
      cache: "no-store",
      credentials: "same-origin", // si un jour tu passes en cookies httpOnly
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    if (!res.ok) {
      const errorBody = await safeReadJson(res);
      const serverMsg = extractErrorMessage(errorBody);

      // messages “propres” côté UI
      if (res.status === 400) throw new Error(serverMsg ?? "Requête invalide.");
      if (res.status === 401) throw new Error(serverMsg ?? "Email ou mot de passe incorrect.");
      if (res.status === 403) throw new Error(serverMsg ?? "Accès refusé.");
      if (res.status === 404) throw new Error(serverMsg ?? "Ressource introuvable.");
      if (res.status >= 500) throw new Error("Erreur serveur. Réessaie plus tard.");

      throw new Error(serverMsg ?? "Erreur réseau.");
    }

    return (await res.json()) as T;
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("Le serveur met trop de temps à répondre (timeout).");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const e = normalizeEmail(email);

  // Validation front (n’empêche pas la validation backend)
  if (!isValidEmail(e)) throw new Error("Email invalide.");
  if (password.length < 8) throw new Error("Mot de passe trop court (8 caractères minimum).");

  return fetchJson<AuthResponse>(`${API_BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email: e, password }),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const e = normalizeEmail(email);

  if (!isValidEmail(e)) throw new Error("Email invalide.");
  if (!password) throw new Error("Mot de passe requis.");

  return fetchJson<AuthResponse>(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: e, password }),
  });
}
