const monthNames: string[] = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export interface Month {
  index: number;
  short: string;
  full: string;
}

export function getMonths(): Month[] {
  return monthNames.map(
    (name, index): Month => ({
      index: index + 1,
      short: name.substring(0, 3),
      full: name,
    }),
  );
}

export interface Day {
  date: Date;
  day: number;
  weekday: string;
  weekdayShort: string;
  isToday?: boolean;
  isPast?: boolean;
}

export function getDaysInMonth(monthIndex: number, year: number): Day[] {
  const daysInMonth: Day[] = [];
  const monthEnd = new Date(year, monthIndex, 0);
  const today = new Date();

  for (let day = 1; day <= monthEnd.getDate(); day++) {
    const currentDate = new Date(year, monthIndex - 1, day);
    daysInMonth.push({
      date: currentDate,
      day: day,
      weekday: currentDate.toLocaleString('de-DE', { weekday: 'long' }),
      weekdayShort: currentDate.toLocaleString('de-DE', { weekday: 'short' }).substring(0, 2),
      isToday: currentDate.toDateString() === today.toDateString(),
      isPast: currentDate < today && currentDate.toDateString() !== today.toDateString(),
    });
  }

  return daysInMonth;
}
