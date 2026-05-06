import { useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher-client';

export function usePusherFixtures(tournamentId: string) {
  const [tables, setTables] = useState<any[]>([]);
  const [upNext, setUpNext] = useState<any[]>([]);

  useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe(`tournament-${tournamentId}-fixtures`);

    channel.bind('match.started', (data: any) => {
      setTables(prev => prev.map(t => 
        t.tableNumber === data.tableNumber 
          ? { ...t, status: 'IN_PROGRESS', currentMatchId: data.matchId, currentMatch: data.match } 
          : t
      ));
      setUpNext(prev => prev.filter(m => m.id !== data.matchId));
    });

    channel.bind('match.completed', (data: any) => {
      setTables(prev => prev.map(t => 
        t.tableNumber === data.tableNumber 
          ? { ...t, status: 'IDLE', currentMatchId: null, currentMatch: null } 
          : t
      ));
    });

    channel.bind('table.updated', (data: any) => {
      setTables(prev => prev.map(t => 
        t.tableNumber === data.tableNumber ? { ...t, ...data } : t
      ));
    });

    channel.bind('match.calling', (data: any) => {
      setTables(prev => prev.map(t => 
        t.tableNumber === data.tableNumber 
          ? { ...t, status: 'CALLING', currentMatchId: data.matchId, currentMatch: data.match } 
          : t
      ));
    });

    return () => {
      pusherClient?.unsubscribe(`tournament-${tournamentId}-fixtures`);
    };
  }, [tournamentId]);

  return { tables, upNext, setTables, setUpNext };
}

