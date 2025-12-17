import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import VersusDetailPage from "./pages/VersusDetailPage";
import VersusResultPage from "./pages/VersusResultPage";
import CreateVersusPage from "./pages/CreateVersusPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import type { Versus } from "./types/versus";
import type { AuthResponse } from "./api/authApi";
import { logout, getAuthToken, setAuthToken } from "./api/authApi";

type AppView = "home" | "detail" | "result" | "create" | "login" | "register" | "profile";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [selectedVersus, setSelectedVersus] = useState<Versus | null>(null);
  const [userChoice, setUserChoice] = useState<"A" | "B" | null>(null);
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [versusItems, setVersusItems] = useState<Versus[]>([]);

  // Restaurer la session au chargement
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // On pourrait décoder le JWT pour récupérer les infos utilisateur
      // Pour l'instant, on simule juste la connexion
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuth({
          accessToken: token,
          user: {
            id: payload.sub,
            email: payload.email,
          }
        });
      } catch (e) {
        // Token invalide, on le supprime
        setAuthToken(null);
      }
    }
  }, []);

  const handleSelectVersus = (versus: Versus) => {
    setSelectedVersus(versus);
    setUserChoice(null);
    setCurrentView("detail");
  };

  const handleVote = (choice: "A" | "B") => {
    setUserChoice(choice);
    setCurrentView("result");
  };

  const handleBack = () => {
    setCurrentView("home");
    setSelectedVersus(null);
    setUserChoice(null);
  };

  const handleOpenCreate = () => setCurrentView("create");
  const handleOpenLogin = () => setCurrentView("login");
  const handleOpenProfile = () => setCurrentView("profile");

  const handleAuthSuccess = (authResponse: AuthResponse) => {
    setAuth(authResponse);
    setCurrentView("home");
  };

  const handleLogout = () => {
    logout();
    setAuth(null);
    setCurrentView("home");
    // Forcer le rechargement pour mettre à jour l'état des titres chiffrés
    window.location.reload();
  };

  const handleSaveNewVersus = (newVersus: Versus) => {
    setVersusItems((prev) => [newVersus, ...prev]);
    setCurrentView("home");
  };

  return (
    <div>
      {currentView === "home" && (
        <HomePage
          versusItems={versusItems}
          onSelectVersus={handleSelectVersus}
          onCreateVersus={handleOpenCreate}
          onOpenLogin={handleOpenLogin}
          onOpenProfile={handleOpenProfile}
          currentUserEmail={auth?.user.email}
        />
      )}

      {currentView === "create" && (
        <CreateVersusPage onBack={() => setCurrentView("home")} onSave={handleSaveNewVersus} />
      )}

      {currentView === "login" && (
        <LoginPage
          onBack={() => setCurrentView("home")}
          onLoginSuccess={handleAuthSuccess}
          onGoToRegister={() => setCurrentView("register")}
        />
      )}

      {currentView === "register" && (
        <RegisterPage
          onBack={() => setCurrentView("home")}
          onRegisterSuccess={handleAuthSuccess}
          onGoToLogin={() => setCurrentView("login")}
        />
      )}

      {currentView === "profile" && auth && (
        <ProfilePage
          user={auth.user}
          onBack={() => setCurrentView("home")}
          onLogout={handleLogout}
        />
      )}

      {currentView === "detail" && selectedVersus && (
        <VersusDetailPage versus={selectedVersus} onVote={handleVote} onBack={handleBack} />
      )}

      {currentView === "result" && selectedVersus && (
        <VersusResultPage versus={selectedVersus} userChoice={userChoice} onBack={handleBack} />
      )}
    </div>
  );
};

export default App;
