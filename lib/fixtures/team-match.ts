import { $Enums } from "@prisma/client";

export type TeamMatchInput = {
  team1Name: string;
  team2Name: string;
  team1Players: string[]; // A, B, C
  team2Players: string[]; // X, Y, Z
  tableNumber: number;
  scheduledStartTime: Date;
  category: string;
};

export function generateTeamMatchSchedule(input: TeamMatchInput) {
  const { team1Players: [A, B, C], team2Players: [X, Y, Z], tableNumber, scheduledStartTime, category } = input;
  const slots: any[] = [];
  const slotDuration = 10 * 60 * 1000;
  const buffer = 2 * 60 * 1000;

  const matches = [
    { p1: A, p2: X, type: $Enums.EventType.MENS_SINGLES, round: "Match 1" },
    { p1: B, p2: Y, type: $Enums.EventType.MENS_SINGLES, round: "Match 2" },
    { p1: [A, C], p2: [X, Z], type: $Enums.EventType.MENS_DOUBLES, round: "Match 3" }, // Doubles
    { p1: B, p2: X, type: $Enums.EventType.MENS_SINGLES, round: "Match 4" },
    { p1: A, p2: Z, type: $Enums.EventType.MENS_SINGLES, round: "Match 5" }, // Conditional
  ];

  matches.forEach((m, i) => {
    const start = new Date(scheduledStartTime.getTime() + i * (slotDuration + buffer));
    const end = new Date(start.getTime() + slotDuration);

    slots.push({
      matchNumber: i + 1,
      tableNumber,
      scheduledStartTime: start,
      scheduledEndTime: end,
      round: m.round,
      category,
      eventType: m.type,
      player1Id: Array.isArray(m.p1) ? m.p1[0] : m.p1,
      player2Id: Array.isArray(m.p2) ? m.p2[0] : m.p2,
      doubles1Partner1Id: Array.isArray(m.p1) ? m.p1[0] : null,
      doubles1Partner2Id: Array.isArray(m.p1) ? m.p1[1] : null,
      doubles2Partner1Id: Array.isArray(m.p2) ? m.p2[0] : null,
      doubles2Partner2Id: Array.isArray(m.p2) ? m.p2[1] : null,
      status: $Enums.MatchStatus.SCHEDULED,
    });
  });

  return slots;
}

export function checkEarlyFinish(currentScore: [number, number]) {
  return currentScore[0] >= 3 || currentScore[1] >= 3;
}
