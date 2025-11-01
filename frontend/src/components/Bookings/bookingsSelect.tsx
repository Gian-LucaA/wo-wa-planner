'use client';

import * as React from 'react';
import { Calendar, CalendarReserved, CalendarSelected } from '@demark-pro/react-booking-calendar';
import { addDays, subDays, startOfDay, format } from 'date-fns';
import { Alert } from '@mui/joy';

import '@demark-pro/react-booking-calendar/dist/react-booking-calendar.css';
import './BookingsSelectOverride.css';
import { Booking } from '@/types/Booking';

interface BookingsSelectProps {
  bookings: Booking[];
  selectedDates: CalendarSelected[];
  setSelectedDates: (dates: CalendarSelected[]) => void;
  year: number;
}

export default function BookingsSelect({ bookings, selectedDates, setSelectedDates, year }: BookingsSelectProps) {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const shrunkRanges: CalendarReserved[] = bookings
    .map((booking) => {
      const start = booking.startDate ? addDays(booking.startDate, 1) : undefined;
      const end = booking.endDate ? subDays(booking.endDate, 1) : undefined;
      if (!start || !end) return undefined;
      if (start > end) return undefined;
      return { startDate: start, endDate: end } as CalendarReserved;
    })
    .filter((r): r is CalendarReserved => Boolean(r));

  const dayCounts = new Map<string, number>();
  bookings.forEach((b) => {
    if (!b.startDate || !b.endDate) return;
    const s = startOfDay(b.startDate);
    const e = startOfDay(b.endDate);
    for (let d = new Date(s); d.getTime() <= e.getTime(); d.setDate(d.getDate() + 1)) {
      const key = format(d, 'yyyy-MM-dd');
      dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
    }
  });

  const overlapDays: CalendarReserved[] = Array.from(dayCounts.entries())
    .filter(([, count]) => count >= 2)
    .map(([key]) => {
      const [y, m, dd] = key.split('-').map((v) => parseInt(v, 10));
      const day = new Date(y, (m ?? 1) - 1, dd ?? 1);
      return { startDate: day, endDate: day } as CalendarReserved;
    });

  const reserved: CalendarReserved[] = [...shrunkRanges, ...overlapDays];

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Alert variant="soft" color="primary" sx={{ mb: 1 }}>
        Buchungen gelten jeweils von 12:00 Uhr bis 12:00 Uhr (Check-in/Check-out).
      </Alert>
      <Calendar
        selected={selectedDates}
        reserved={reserved}
        onChange={setSelectedDates}
        options={{ weekStartsOn: 1 }}
        range={true}
        protection={true}
        year={year}
      />
    </div>
  );
}
