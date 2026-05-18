import React from 'react';
import connectToDatabase from '@/lib/mongodb';
import { MatchSlot, Tournament } from '@/models';
import ScheduleGrid from '@/components/fixtures/ScheduleGrid';

export const dynamic = "force-dynamic";

async function getScheduleData(tournamentId: string) {
  try {
    await connectToDatabase();

    const [slotsRaw, tournament] = await Promise.all([
      MatchSlot.find({ tournamentId })
        .sort({ scheduledStartTime: 1 })
        .lean(),
      Tournament.findById(tournamentId)
        .select("startDate")
        .lean()
    ]);

    return { 
      slots: slotsRaw.map((s: any) => ({ ...s, id: s._id.toString() })), 
      startTime: (tournament as any)?.startDate || new Date() 
    };
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return { slots: [], startTime: new Date() };
  }
}

export default async function TournamentSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { slots, startTime } = await getScheduleData(id);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-['Bebas_Neue'] text-[#E85D04]">TOURNAMENT SCHEDULE</h1>
            <p className="text-gray-400">Full timeline — Nehru Stadium</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-[#E85D04] rounded" /> <span>Senior</span>
                <div className="w-3 h-3 bg-[#0077B6] rounded ml-2" /> <span>Junior</span>
                <div className="w-3 h-3 bg-[#2D6A4F] rounded ml-2" /> <span>Sub Junior</span>
                <div className="w-3 h-3 bg-purple-600 rounded ml-2" /> <span>Cadet</span>
             </div>
          </div>
        </header>

        <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
           <ScheduleGrid slots={slots} startTime={startTime} />
        </div>
      </div>
    </div>
  );
}
