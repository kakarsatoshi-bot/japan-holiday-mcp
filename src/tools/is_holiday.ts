import { getHolidaysMap } from "../data/holidays";

export const isHolidayToolDefinition = {
  name: "is_holiday",
  description:
    "Check whether a given date is a Japanese national holiday or substitute holiday. Returns the holiday name if it is one.",
  inputSchema: {
    type: "object" as const,
    properties: {
      date: {
        type: "string",
        description: "Date to check in YYYY-MM-DD format (e.g. '2026-01-01')",
      },
    },
    required: ["date"],
  },
};

export async function handleIsHoliday(args: { date: string }): Promise<string> {
  const holidays = await getHolidaysMap();
  const name = holidays.get(args.date);

  return JSON.stringify({
    date: args.date,
    is_holiday: name !== undefined,
    name: name ?? null,
  });
}
