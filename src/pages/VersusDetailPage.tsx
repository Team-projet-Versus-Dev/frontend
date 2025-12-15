import React from "react";
import { ArrowLeft, Users } from "lucide-react";
import SafeText from "../component/SafeText";
import type { Versus } from "../types/versus";

type VersusDetailPageProps = {
  versus: Versus;
  onVote: (choice: "A" | "B") => void;
  onBack: () => void;
};

const VersusDetailPage: React.FC<VersusDetailPageProps> = ({ versus, onVote, onBack }) => {
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

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => onVote("A")}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-black hover:shadow-lg transition-all"
          >
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-6xl text-gray-300 font-bold">A</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 text-center">{versus.optionA.text}</div>
          </button>

          <button
            onClick={() => onVote("B")}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-black hover:shadow-lg transition-all"
          >
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-6xl text-gray-300 font-bold">B</span>
            </div>
            <div className="text-xl font-semibold text-gray-900 text-center">{versus.optionB.text}</div>
          </button>
        </div>

        {/* Total votes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Total des votes</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{versus.totalVotes.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default VersusDetailPage;
