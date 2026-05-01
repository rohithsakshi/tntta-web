"use client";

import React from 'react';

type TableCardProps = {
  tableNumber: number;
  match?: any;
  status: string;
};

const TableCard = ({ tableNumber, match, status }: TableCardProps) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'IN_PROGRESS': return 'border-[#2D6A4F]';
      case 'CALLING': return 'border-[#E85D04] animate-pulse';
      case 'DELAYED': return 'border-[#991B1B]';
      default: return 'border-gray-700';
    }
  };

  return (
    <div className={`bg-[#111] border-l-4 ${getStatusColor(status)} p-5 rounded-lg shadow-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-['Bebas_Neue'] text-[#E85D04]">TABLE {tableNumber}</h3>
        <span className={`px-2 py-1 text-xs rounded font-bold uppercase ${
          status === 'IN_PROGRESS' ? 'bg-[#2D6A4F] text-white' : 
          status === 'CALLING' ? 'bg-[#E85D04] text-white' : 
          'bg-gray-800 text-gray-400'
        }`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      {match ? (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">{match.category} — {match.round}</p>
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-xl font-bold text-white uppercase">{match.player1?.firstName} {match.player1?.lastName}</p>
              <p className="text-xs text-gray-500">{match.player1?.district}</p>
            </div>
            <div className="px-4 text-[#E85D04] font-['Bebas_Neue'] text-2xl">VS</div>
            <div className="text-center flex-1">
              <p className="text-xl font-bold text-white uppercase">{match.player2?.firstName} {match.player2?.lastName}</p>
              <p className="text-xs text-gray-500">{match.player2?.district}</p>
            </div>
          </div>
          
          <div className="mt-4">
             <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>⏱ Started: 9:42 AM</span>
                <span>Est. End: 9:52 AM</span>
             </div>
             <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#2D6A4F] h-full w-[70%]" />
             </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-600 italic">
          Table Available
        </div>
      )}
    </div>
  );
};

export default TableCard;
