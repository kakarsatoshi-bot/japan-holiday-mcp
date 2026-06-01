import { getHolidaysMap, Holiday } from "../data/holidays";

export const getHolidaysInMonthToolDefinition = {
  name: "get_holidays_in_month",
  description:
    "List all Japanese national holidays and substitute holidays in a given year and month.",
  inputSchema: {
    type: "object" as const,
    properties: {
      year: {
        type: "number",
        description: "Year (e.g. 2026)",
      },
      month: {
        type: "number",
        description: "Month as a number 1–12 (e.g. 1 for January)",
      },
    },
    required: ["year", "month"],
  },
};

export async function handleGetHolidaysInMonth(args: {
  year: number;
  month: number;
}): Promise<string> {
  const holidays = await getHolidaysMap();

  const prefix = `${String(args.year).padStart(4, "0")}-${String(args.month).padStart(2, "0")}-`;
  const result: Holiday[] = [];

  for (const [date, name] of holidays.entries()) {
    if (date.startsWith(prefix)) {
      result.push({ date, name });
    }
  }

  result.sort((a, b) => a.date.localeCompare(b.date));

  return JSON.stringify({
    year: args.year,
    month: args.month,
    holidays: result,
    count: result.length,
  });
}
