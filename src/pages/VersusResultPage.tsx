import React from "react";
import { ArrowLeft, Users } from "lucide-react";
import type { Versus } from "../types/versus";

type VersusResultPageProps = {
  versus: Versus;
  userChoice: "A" | "B" | null;
  onBack: () => void;
};

const VersusResultPage: React.FC<VersusResultPageProps> = ({ versus, userChoice, onBack }) => {
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
        <div className="text-center mb-6">
          <span className="text-sm font-medium text-gray-600">{versus.category}</span>
        </div>

        {/* Question */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-12">Tu préfères... ?</h1>

        {/* Results */}
        <div className="space-y-4 mb-12">
          {/* Option A */}
          <div
            className={`bg-white border-2 rounded-xl p-6 ${
              userChoice === "A" ? "border-black" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-900">{versus.optionA.text}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{versus.optionA.percentage}%</span>
                {userChoice === "A" && (
                  <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
                    Ton choix
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-black h-full rounded-full transition-all duration-500"
                style={{ width: `${versus.optionA.percentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">{versus.optionA.votes.toLocaleString()} votes</div>
          </div>

          {/* Option B */}
          <div
            className={`bg-white border-2 rounded-xl p-6 ${
              userChoice === "B" ? "border-black" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-900">{versus.optionB.text}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{versus.optionB.percentage}%</span>
                {userChoice === "B" && (
                  <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
                    Ton choix
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-black h-full rounded-full transition-all duration-500"
                style={{ width: `${versus.optionB.percentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">{versus.optionB.votes.toLocaleString()} votes</div>
          </div>
        </div>

        {/* Total votes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Total des votes</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{versus.totalVotes.toLocaleString()}</div>
        </div>

        {/* Comments Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Commentaires</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">Utilisateur 1</span>
                  <span className="text-sm text-gray-500">il y a 2h</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersusResultPage;
