"use client";

import React, { useState, useEffect } from 'react';
import AdminTableCard from './AdminTableCard';
import { usePusherFixtures } from './usePusherFixtures';
import toast from 'react-hot-toast';

type AdminFixturesControlProps = {
  tournamentId: string;
  initialTables: any[];
  initialUpNext: any[];
};

export default function AdminFixturesControl({ tournamentId, initialTables, initialUpNext }: AdminFixturesControlProps) {
  const { tables, upNext, setTables, setUpNext } = usePusherFixtures(tournamentId);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setTables(initialTables);
    setUpNext(initialUpNext);
  }, [initialTables, initialUpNext]);

  const generateFixtures = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/fixtures/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Generated ${data.matchesGenerated} matches!`);
        window.location.reload(); // Refresh to get initial state
      } else {
        toast.error(data.error || "Failed to generate");
      }
    } catch (error) {
      toast.error("Error generating fixtures");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearFixtures = async () => {
    if (!confirm("Are you sure you want to clear ALL fixtures?")) return;
    try {
      const res = await fetch(`/api/admin/fixtures/${tournamentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success("Fixtures cleared");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error clearing fixtures");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center bg-[#111] p-6 rounded-lg border border-gray-800">
        <div>
          <h1 className="text-4xl font-['Bebas_Neue'] text-[#E85D04]">ADMIN CONTROL ROOM</h1>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">Tournament ID: {tournamentId}</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={generateFixtures}
             disabled={isGenerating}
             className="bg-gray-800 px-4 py-2 rounded text-xs font-bold uppercase hover:bg-gray-700 transition-all disabled:opacity-50"
           >
             {isGenerating ? "Generating..." : "Generate Fixtures"}
           </button>
           <button 
             onClick={clearFixtures}
             className="bg-[#991B1B] px-4 py-2 rounded text-xs font-bold uppercase hover:bg-red-700 transition-all"
           >
             Clear All
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table: any) => (
                <AdminTableCard 
                  key={table.tableNumber} 
                  tableNumber={table.tableNumber} 
                  status={table.status} 
                  match={table.currentMatch}
                />
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#111] p-5 rounded-lg border border-gray-800">
              <h2 className="text-xl font-['Bebas_Neue'] text-[#E85D04] mb-4">⚠ LIVE ALERTS</h2>
              <div className="space-y-3">
                 {/* This would be populated by pusher events for noshows */}
                 <p className="text-gray-600 italic text-[10px]">No active alerts</p>
              </div>
           </div>

           <div className="bg-[#111] p-5 rounded-lg border border-gray-800">
              <h2 className="text-xl font-['Bebas_Neue'] text-[#E85D04] mb-4">📋 NEXT IN QUEUE</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                 {upNext.map((match: any, i: number) => (
                   <div key={match.id} className="bg-[#1a1a1a] p-3 rounded border border-gray-800 text-[10px]">
                      <div className="flex justify-between font-bold mb-1">
                         <span>{match.player1?.firstName} vs {match.player2?.firstName}</span>
                         <span className="text-[#E85D04]">T{match.tableNumber}</span>
                      </div>
                      <p className="text-gray-500">
                        {new Date(match.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {match.category} • {match.round}
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
