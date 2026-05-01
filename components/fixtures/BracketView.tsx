"use client";

import React from 'react';

const BracketMatch = ({ player1, player2, score1, score2, status }: any) => {
  return (
    <div className="w-48 mb-8 relative">
      <div className={`bg-[#111] border ${status === 'IN_PROGRESS' ? 'border-[#E85D04] animate-pulse' : 'border-gray-800'} rounded overflow-hidden shadow-lg`}>
        <div className="flex justify-between p-2 border-b border-gray-800">
          <span className={`text-xs ${score1 > score2 ? 'font-bold text-white' : 'text-gray-500'}`}>{player1 || 'TBD'}</span>
          <span className={`text-xs font-bold ${score1 > score2 ? 'text-green-500' : 'text-gray-600'}`}>{score1 || 0}</span>
        </div>
        <div className="flex justify-between p-2">
          <span className={`text-xs ${score2 > score1 ? 'font-bold text-white' : 'text-gray-500'}`}>{player2 || 'TBD'}</span>
          <span className={`text-xs font-bold ${score2 > score1 ? 'text-green-500' : 'text-gray-600'}`}>{score2 || 0}</span>
        </div>
      </div>
      <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-gray-700" />
    </div>
  );
};

export default function BracketView({ rounds = [] }: { rounds?: any[] }) {
  if (!rounds || rounds.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] text-gray-600 italic">
        Bracket not yet generated
      </div>
    );
  }

  return (
    <div className="flex gap-16 p-10 overflow-x-auto min-h-[600px] bg-[#0A0A0A]">
      {rounds.map((round, roundIdx) => (
        <div key={roundIdx} className="flex flex-col justify-around">
          {round.matches.map((match: any, matchIdx: number) => (
            <BracketMatch 
              key={matchIdx}
              player1={match.player1?.firstName}
              player2={match.player2?.firstName}
              score1={match.score1}
              score2={match.score2}
              status={match.status}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

