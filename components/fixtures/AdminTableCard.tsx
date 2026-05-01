"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ResultEntry from './ResultEntry';

type AdminTableCardProps = {
  tableNumber: number;
  match?: any;
  status: string;
};

const AdminTableCard = ({ tableNumber, match, status }: AdminTableCardProps) => {
  const [loading, setLoading] = useState(false);
  const [showResultEntry, setShowResultEntry] = useState(false);

  const handleAction = async (action: string, payload: any = {}) => {
    if (!match?.id && action !== 'assign') return;
    setLoading(true);
    try {
      let endpoint = '';
      
      switch (action) {
        case 'call':
          endpoint = `/api/admin/fixtures/match/${match.id}/call`;
          break;
        case 'start':
          endpoint = `/api/admin/fixtures/match/${match.id}/start`;
          break;
        case 'walkover':
          endpoint = `/api/admin/fixtures/match/${match.id}/walkover`;
          payload = { absentPlayerId: match.player1Id, reason: 'NO_SHOW' }; 
          break;
        case 'complete':
          endpoint = `/api/admin/fixtures/match/${match.id}/complete`;
          break;
        case 'delay':
          endpoint = `/api/admin/fixtures/match/${match.id}/delay`;
          break;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: Object.keys(payload).length ? JSON.stringify(payload) : undefined,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${action} successful`);
      } else {
        toast.error(data.error || `Failed to ${action}`);
      }
    } catch (error) {
      toast.error(`Error during ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (playerId: string, present: boolean) => {
    try {
      const res = await fetch(`/api/admin/fixtures/match/${match.id}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1Present: match.player1Id === playerId ? present : match.player1Present,
          player2Present: match.player2Id === playerId ? present : match.player2Present,
        }),
      });
      if (res.ok) toast.success("Attendance updated");
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 p-5 rounded-lg relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-['Bebas_Neue'] text-[#E85D04]">TABLE {tableNumber}</h3>
        <span className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400 font-bold uppercase">{status}</span>
      </div>

      {match ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#111] p-3 rounded">
            <div className="text-center">
               <p className="text-sm font-bold">{match.player1?.firstName}</p>
               <div className="flex gap-1 mt-2">
                 <button 
                   onClick={() => markAttendance(match.player1Id, true)}
                   className={`text-[10px] px-2 py-1 rounded ${match.player1Present ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                 >✓</button>
                 <button 
                   onClick={() => markAttendance(match.player1Id, false)}
                   className={`text-[10px] px-2 py-1 rounded ${!match.player1Present ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                 >✗</button>
               </div>
            </div>
            <span className="text-[#E85D04] font-bold">VS</span>
            <div className="text-center">
               <p className="text-sm font-bold">{match.player2?.firstName}</p>
               <div className="flex gap-1 mt-2">
                 <button 
                   onClick={() => markAttendance(match.player2Id, true)}
                   className={`text-[10px] px-2 py-1 rounded ${match.player2Present ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                 >✓</button>
                 <button 
                   onClick={() => markAttendance(match.player2Id, false)}
                   className={`text-[10px] px-2 py-1 rounded ${!match.player2Present ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                 >✗</button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {status === 'SCHEDULED' && (
              <button 
                onClick={() => handleAction('call')}
                disabled={loading}
                className="col-span-2 bg-[#E85D04] text-white py-2 rounded text-xs font-bold uppercase hover:bg-[#ff6d00] transition-colors"
              >
                📣 Call Players
              </button>
            )}
            
            {status === 'CALLING' && (
              <>
                <button 
                  onClick={() => handleAction('start')}
                  disabled={loading || !match.player1Present || !match.player2Present}
                  className="bg-[#2D6A4F] text-white py-2 rounded text-xs font-bold uppercase disabled:opacity-50"
                >▶ Start</button>
                <button 
                  onClick={() => handleAction('walkover')}
                  disabled={loading}
                  className="bg-red-900/50 text-red-500 py-2 rounded text-xs font-bold uppercase"
                >🚶 Walkover</button>
              </>
            )}

            {status === 'IN_PROGRESS' && (
              <>
                <button 
                  onClick={() => setShowResultEntry(true)}
                  disabled={loading}
                  className="bg-blue-900/50 text-blue-400 py-2 rounded text-xs font-bold uppercase"
                >Enter Result</button>
                <button 
                  onClick={() => handleAction('delay', { estimatedExtraMinutes: 5 })}
                  disabled={loading}
                  className="bg-yellow-900/50 text-yellow-500 py-2 rounded text-xs font-bold uppercase"
                >+5 Min</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="h-32 flex flex-col items-center justify-center">
            <p className="text-gray-600 italic text-sm mb-4">Table Idle</p>
        </div>
      )}

      {showResultEntry && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <button 
              onClick={() => setShowResultEntry(false)} 
              className="absolute -top-12 right-0 text-white text-4xl hover:text-[#E85D04] transition-colors"
            >&times;</button>
            <ResultEntry 
              match={match} 
              onConfirm={(data: any) => {
                handleAction('complete', data);
                setShowResultEntry(false);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTableCard;
