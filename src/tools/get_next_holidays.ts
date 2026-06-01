import { getHolidaysMap } from "../data/holidays";

export const getNextHolidaysToolDefinition = {
  name: "get_next_holidays",
  description:
    "Get the next N upcoming Japanese national holidays from today (Japan Standard Time). Includes how many days until each holiday.",
  inputSchema: {
    type: "object" as const,
    properties: {
      count: {
        type: "number",
        description: "Number of upcoming holidays to return (default: 3)",
      },
    },
    required: [],
  },
};

function getTodayJST(): string {
  // JST = UTC+9
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

export async function handleGetNextHolidays(args: {
  count?: number;
}): Promise<string> {
  const holidays = await getHolidaysMap();
  const limit = args.count ?? 3;
  const today = getTodayJST();

  const upcoming = Array.from(holidays.entries())
    .filter(([date]) => date >= today)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, limit)
    .map(([date, name]) => {
      const diffMs =
        new Date(date).getTime() - new Date(today).getTime();
      const days_until = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return { date, name, days_until };
    });

  return JSON.stringify({
    today,
    holidays: upcoming,
    count: upcoming.length,
  });
}
