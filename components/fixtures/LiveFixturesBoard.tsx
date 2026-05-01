"use client";

import React, { useEffect, useState } from 'react';
import TableCard from './TableCard';
import { usePusherFixtures } from './usePusherFixtures';

type LiveFixturesBoardProps = {
  tournamentId: string;
  initialTables: any[];
  initialUpNext: any[];
};

export default function LiveFixturesBoard({ tournamentId, initialTables, initialUpNext }: LiveFixturesBoardProps) {
  const { tables, upNext, setTables, setUpNext } = usePusherFixtures(tournamentId);

  useEffect(() => {
    setTables(initialTables);
    setUpNext(initialUpNext);
  }, [initialTables, initialUpNext]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Section A: Playing Now */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tables.map((table: any) => (
            <TableCard 
              key={table.tableNumber} 
              tableNumber={table.tableNumber} 
              status={table.status} 
              match={table.currentMatch} 
            />
          ))}
        </div>
      </div>

      {/* Section B: Up Next */}
      <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
        <h2 className="text-4xl font-['Bebas_Neue'] text-[#E85D04] mb-6">🔜 UP NEXT</h2>
        <div className="space-y-4">
          {upNext.length > 0 ? upNext.map((match: any, i: number) => (
            <div key={match.id} className="flex items-center gap-4 border-b border-gray-800 pb-4 last:border-0">
              <span className="text-gray-600 font-bold">#{i + 1}</span>
              <div className="flex-1">
                <p className="font-bold">{match.player1?.firstName} vs {match.player2?.firstName}</p>
                <p className="text-[10px] text-gray-500 uppercase">TABLE {match.tableNumber} • {match.category} • {match.round}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400">
                  {new Date(match.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )) : (
            <p className="text-gray-600 italic">No matches queued</p>
          )}
        </div>
      </div>
    </div>
  );
}
