import React from 'react';

export default function PlayerFixturesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-md mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-['Bebas_Neue'] text-[#E85D04]">MY FIXTURES</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Chennai State Ranking 2026</p>
        </header>

        {/* Next Match Card */}
        <div className="bg-[#111] border border-[#E85D04] rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#E85D04] text-white px-4 py-1 text-[10px] font-bold uppercase rounded-bl-xl animate-pulse">Calling Now</div>
          
          <h2 className="text-gray-400 text-xs font-bold uppercase mb-6 tracking-widest">Your Next Match</h2>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold uppercase">YOU</p>
              <p className="text-[#E85D04] font-['Bebas_Neue'] text-4xl my-2">VS</p>
              <p className="text-3xl font-bold uppercase">KARTHIK SURESH</p>
              <p className="text-xs text-gray-500 mt-1">Seeded #6 • Coimbatore</p>
            </div>

            <div className="bg-[#0A0A0A] rounded-xl p-6 flex justify-between items-center border border-gray-800">
               <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Table</p>
                  <p className="text-3xl font-['Bebas_Neue'] text-[#E85D04]">TABLE 7</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Est. Time</p>
                  <p className="text-3xl font-['Bebas_Neue'] text-white">10:45 AM</p>
               </div>
            </div>

            <div className="bg-[#E85D04]/10 border border-[#E85D04]/30 p-4 rounded-lg text-center">
               <p className="text-[#E85D04] text-xs font-bold uppercase">🟠 PLEASE REPORT TO TABLE 7 NOW</p>
            </div>
          </div>
        </div>

        {/* Full Schedule */}
        <div className="space-y-4">
           <h3 className="text-xl font-['Bebas_Neue'] text-gray-500 mb-4 uppercase">My Full Schedule</h3>
           {[
             { round: 'Round of 32', opp: 'Ajay R', status: 'WON (3-0)', time: '09:00 AM' },
             { round: 'Quarterfinal', opp: 'Karthik S', status: 'CALLING', time: '10:45 AM' },
             { round: 'Doubles R16', opp: 'Team B', status: 'SCHEDULED', time: '02:30 PM' }
           ].map((m, i) => (
             <div key={i} className="bg-[#111] p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase">{m.round}</p>
                   <p className="text-sm font-bold uppercase">{m.opp}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">{m.time}</p>
                   <p className={`text-[10px] font-bold uppercase ${m.status.includes('WON') ? 'text-[#2D6A4F]' : m.status === 'CALLING' ? 'text-[#E85D04]' : 'text-gray-600'}`}>{m.status}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
