"use client";

import React, { useState } from 'react';

const ResultEntry = ({ match, onConfirm }: any) => {
  const [games, setGames] = useState([{ s1: 0, s2: 0 }, { s1: 0, s2: 0 }, { s1: 0, s2: 0 }]);

  const updateScore = (idx: number, player: number, val: number) => {
    const newGames = [...games];
    if (player === 1) newGames[idx].s1 = val;
    else newGames[idx].s2 = val;
    setGames(newGames);
  };

  const calculateWinner = () => {
    let p1Wins = 0;
    let p2Wins = 0;
    games.forEach(g => {
      if (g.s1 >= 11 && g.s1 - g.s2 >= 2) p1Wins++;
      else if (g.s2 >= 11 && g.s2 - g.s1 >= 2) p2Wins++;
    });
    if (p1Wins >= 3) return match.player1?.firstName;
    if (p2Wins >= 3) return match.player2?.firstName;
    return "TBD";
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 w-full max-w-md">
      <h3 className="text-xl font-['Bebas_Neue'] text-[#E85D04] mb-6 text-center">ENTER MATCH RESULT</h3>
      
      <div className="space-y-4">
        {games.map((g, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-[10px] text-gray-500 font-bold w-12 uppercase">Game {i+1}</span>
            <input 
              type="number" 
              className="w-full bg-[#0A0A0A] border border-gray-700 rounded p-2 text-center text-white" 
              value={g.s1} 
              onChange={(e) => updateScore(i, 1, parseInt(e.target.value) || 0)}
            />
            <span className="text-gray-600">—</span>
            <input 
              type="number" 
              className="w-full bg-[#0A0A0A] border border-gray-700 rounded p-2 text-center text-white" 
              value={g.s2} 
              onChange={(e) => updateScore(i, 2, parseInt(e.target.value) || 0)}
            />
          </div>
        ))}

        <button 
          onClick={() => setGames([...games, { s1: 0, s2: 0 }])}
          className="w-full border border-dashed border-gray-700 text-gray-500 py-2 rounded text-[10px] uppercase hover:bg-gray-800 transition-all"
        >
          + Add Game
        </button>

        <div className="mt-8 pt-4 border-t border-gray-800">
           <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-gray-400 uppercase font-bold">Winner:</span>
              <span className="text-sm font-bold text-[#2D6A4F] uppercase">{calculateWinner()}</span>
           </div>
           <button className="w-full bg-[#2D6A4F] text-white py-3 rounded font-bold uppercase tracking-widest hover:bg-[#1a4d35] transition-all">
              ✅ Confirm Result
           </button>
        </div>
      </div>
    </div>
  );
};

export default ResultEntry;
