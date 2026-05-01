"use client";

import React from 'react';

const ScheduleGrid = ({ slots = [], startTime = new Date() }: { slots?: any[], startTime?: Date }) => {
  const times: string[] = [];
  const startHour = startTime.getHours();
  for (let i = 0; i < 12; i++) {
    times.push(`${(startHour + i) % 12 || 12}:00 ${startHour + i >= 12 ? 'PM' : 'AM'}`);
  }
  
  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  const getCategoryColor = (cat: string) => {
    const colors: any = {
      'SENIOR': 'bg-[#E85D04]',
      'JUNIOR': 'bg-[#0077B6]',
      'SUB_JUNIOR': 'bg-[#2D6A4F]',
      'CADET': 'bg-purple-600',
      'MINI_CADET': 'bg-pink-600'
    };
    return colors[cat] || 'bg-gray-600';
  };

  const getLeftOffset = (scheduledTime: Date) => {
    const diffMs = new Date(scheduledTime).getTime() - new Date(startTime).getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    return `${(diffHrs / 12) * 100}%`;
  };

  const getWidth = (durationMinutes: number = 10) => {
    return `${(durationMinutes / (12 * 60)) * 100}%`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* Time Header */}
        <div className="flex border-b border-gray-800 ml-20">
          {times.map(t => (
            <div key={t} className="flex-1 p-2 text-[10px] text-gray-500 font-bold text-center border-r border-gray-900 last:border-0">{t}</div>
          ))}
        </div>

        {/* Table Rows */}
        {tables.map(tableNum => (
          <div key={tableNum} className="flex border-b border-gray-900 group h-16">
            <div className="w-20 p-4 bg-[#111] text-xs font-bold text-[#E85D04] sticky left-0 z-10 border-r border-gray-800">TABLE {tableNum}</div>
            <div className="flex-1 flex relative">
              {slots.filter(s => s.tableNumber === tableNum).map(slot => (
                <div 
                  key={slot.id}
                  className={`absolute h-[80%] top-[10%] ${getCategoryColor(slot.category)} opacity-80 border-r border-black/20 flex items-center justify-center cursor-pointer hover:opacity-100 transition-all rounded p-1`}
                  style={{ 
                    left: getLeftOffset(slot.scheduledStartTime),
                    width: getWidth(10) // 10 min slots
                  }}
                >
                   <span className="text-[7px] font-bold text-white uppercase truncate">{slot.category}</span>
                </div>
              ))}
              
              {/* Grid lines */}
              {times.map(t => (
                <div key={t} className="flex-1 border-r border-gray-900/30 last:border-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;

