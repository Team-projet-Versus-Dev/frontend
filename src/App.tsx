// src/App.tsx
import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import VersusDetailPage from "./pages/VersusDetailPage";
import VersusResultPage from "./pages/VersusResultPage";
import CreateVersusPage from "./pages/CreateVersusPage";
import type { Versus } from "./types/versus";

type AppView = "home" | "detail" | "result" | "create";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [selectedVersus, setSelectedVersus] = useState<Versus | null>(null);
  const [userChoice, setUserChoice] = useState<"A" | "B" | null>(null);

  // ✅ liste globale des questionnaires "Versus"
  // (au début vide, plus tard elle viendra de la BDD)
  const [versusItems, setVersusItems] = useState<Versus[]>([]);

  // Quand on clique sur une carte "Versus" de la HomePage
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

  const handleOpenCreate = () => {
    setCurrentView("create");
  };

  // appelé par CreateVersusPage quand on sauvegarde un nouveau questionnaire
  const handleSaveNewVersus = (newVersus: Versus) => {
    setVersusItems((prev) => [newVersus, ...prev]); // on l’ajoute en haut de la liste
    setCurrentView("home");
  };

  return (
    <div>
      {/* Vue d'accueil */}
      {currentView === "home" && (
        <HomePage
          versusItems={versusItems}
          onSelectVersus={handleSelectVersus}
          onCreateVersus={handleOpenCreate}
        />
      )}

      {/* Création d’un questionnaire */}
      {currentView === "create" && (
        <CreateVersusPage
          onBack={() => setCurrentView("home")}
          onSave={handleSaveNewVersus}
        />
      )}

      {/* Détail d’un Versus */}
      {currentView === "detail" && selectedVersus && (
        <VersusDetailPage
          versus={selectedVersus}
          onVote={handleVote}
          onBack={handleBack}
        />
      )}

      {/* Résultat après vote */}
      {currentView === "result" && selectedVersus && (
        <VersusResultPage
          versus={selectedVersus}
          userChoice={userChoice}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default App;
