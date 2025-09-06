'use client';

import { useState } from 'react';

export default function CharacterSheetSimple() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Hit Points state
  const [hitPointRolls, setHitPointRolls] = useState<number[]>(Array(20).fill(0));
  const [additionalHPBonuses, setAdditionalHPBonuses] = useState(0);
  const [hasToughness, setHasToughness] = useState(false);
  const [isPHBHillDwarf, setIsPHBHillDwarf] = useState(false);

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold text-amber-400 mb-8 text-center">D&D 5e Character Sheet</h1>
      
      {/* Hit Points Section */}
      <div className={`rounded-lg p-6 shadow-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
      }`}>
        <h3 className="text-xl font-semibold text-amber-300 mb-4">Hit Points</h3>
        <p className="text-sm text-gray-300 mb-6">
          Enter the hit points you rolled for each level. Do not include your Con mod.
        </p>
        
        <div className="space-y-4">
          {/* Single Row with Level Headers */}
          <div className="flex gap-2 text-xs font-bold text-gray-400 text-center">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="flex-1 min-w-0">Lvl {i + 1}</div>
            ))}
          </div>
          
          {/* Single Row with HP Input Boxes */}
          <div className="flex gap-2">
            {Array.from({ length: 20 }, (_, i) => (
              <input
                key={i}
                type="number"
                min="1"
                max="20"
                value={hitPointRolls[i] || ''}
                onChange={(e) => {
                  const newRolls = [...hitPointRolls];
                  newRolls[i] = parseInt(e.target.value) || 0;
                  setHitPointRolls(newRolls);
                }}
                className={`flex-1 min-w-0 text-center text-sm border rounded px-2 py-1 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="0"
              />
            ))}
          </div>

          {/* Additional Options Below */}
          <div className="mt-6 space-y-3">
            {/* Additional Bonuses */}
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="text-sm font-medium text-gray-300">Additional Bonuses</div>
              <input
                type="number"
                value={additionalHPBonuses}
                onChange={(e) => setAdditionalHPBonuses(parseInt(e.target.value) || 0)}
                className={`w-full text-center text-sm border rounded px-2 py-1 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="+0"
              />
            </div>

            {/* Toughness Feat */}
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="text-sm font-medium text-gray-300">Toughness?</div>
              <select
                value={hasToughness ? 'Yes' : 'No'}
                onChange={(e) => setHasToughness(e.target.value === 'Yes')}
                className={`w-full text-center text-sm border rounded px-2 py-1 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* PHB Hill Dwarf */}
            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="text-sm font-medium text-gray-300">PHB Hill Dwarf?</div>
              <select
                value={isPHBHillDwarf ? 'Yes' : 'No'}
                onChange={(e) => setIsPHBHillDwarf(e.target.value === 'Yes')}
                className={`w-full text-center text-sm border rounded px-2 py-1 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dark/Light Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isDarkMode
            ? 'bg-amber-500 hover:bg-amber-400 text-gray-900'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
        aria-label="Toggle dark/light mode"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isDarkMode ? '☀️' : '🌙'}
        </div>
      </button>
    </div>
  );
}