const POLISH_FIXED_HOLIDAYS: Array<[number, number]> = [
  [1, 1],
  [1, 6],
  [5, 1],
  [5, 3],
  [8, 15],
  [11, 1],
  [11, 11],
  [12, 25],
  [12, 26],
];

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getEasterSunday = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getPolishHolidayKeys = (year: number) => {
  const keys = new Set<string>();
  POLISH_FIXED_HOLIDAYS.forEach(([month, day]) => {
    keys.add(formatDateKey(new Date(year, month - 1, day)));
  });

  const easterSunday = getEasterSunday(year);
  keys.add(formatDateKey(easterSunday));
  keys.add(formatDateKey(addDays(easterSunday, 1))); // Easter Monday
  keys.add(formatDateKey(addDays(easterSunday, 49))); // Pentecost Sunday
  keys.add(formatDateKey(addDays(easterSunday, 60))); // Corpus Christi

  return keys;
};

export const isPolishPublicHoliday = (date: Date, apiHolidayKeys: Set<string> | null) => {
  // Night rate also applies on Sundays.
  if (date.getDay() === 0) {
    return true;
  }
  const dateKey = formatDateKey(date);
  if (apiHolidayKeys?.has(dateKey)) {
    return true;
  }
  const fallbackKeys = getPolishHolidayKeys(date.getFullYear());
  return fallbackKeys.has(dateKey);
};

