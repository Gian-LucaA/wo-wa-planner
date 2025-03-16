'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, CalendarSelected } from '@demark-pro/react-booking-calendar';

import '@demark-pro/react-booking-calendar/dist/react-booking-calendar.css';

const oneDay = 86400000;
const today = new Date().getTime() + oneDay;

const reserved = Array.from({ length: 3 }, (_, i) => {
  const daysCount = Math.floor(Math.random() * (7 - 4) + 3);
  const startDate = new Date(today + oneDay * 8 * i);

  return {
    startDate,
    endDate: new Date(startDate.getTime() + oneDay * daysCount),
  };
});

export default function BookingCalendar() {
  const pathname = usePathname();
  const place_id = pathname.split('/').pop();

  const [selectedDates, setSelectedDates] = React.useState<CalendarSelected[]>([]);

  return <Calendar selected={selectedDates} reserved={reserved} onChange={setSelectedDates} />;
}
