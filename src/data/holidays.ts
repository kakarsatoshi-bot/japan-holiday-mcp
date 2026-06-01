const CSV_URL = "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv";

export interface Holiday {
  date: string; // ISO 8601: "YYYY-MM-DD"
  name: string;
}

// Module-level cache. Persists for the lifetime of the Durable Object instance.
let cache: Map<string, string> | null = null;

async function fetchAndParse(): Promise<Map<string, string>> {
  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error(`CSV fetch failed: HTTP ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  // 内閣府CSVはShift-JISエンコーディング
  const text = new TextDecoder("shift_jis").decode(buffer);

  const holidays = new Map<string, string>();
  const lines = text.split(/\r?\n/);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const commaIdx = line.indexOf(",");
    if (commaIdx === -1) continue;

    const rawDate = line.slice(0, commaIdx).trim();
    const name = line.slice(commaIdx + 1).trim();
    if (!rawDate || !name) continue;

    // "YYYY/M/D" → "YYYY-MM-DD"
    const parts = rawDate.split("/");
    if (parts.length !== 3) continue;

    const [y, m, d] = parts;
    if (!/^\d{4}$/.test(y) || !m || !d) continue;

    const isoDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    holidays.set(isoDate, name);
  }

  return holidays;
}

export async function getHolidaysMap(): Promise<Map<string, string>> {
  if (!cache) {
    cache = await fetchAndParse();
  }
  return cache;
}
