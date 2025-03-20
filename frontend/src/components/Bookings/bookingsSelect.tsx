'use client';

import * as React from 'react';
import { Day } from '@/helpers/calendar/dateUtils';
import { Calendar, CalendarSelected } from '@demark-pro/react-booking-calendar';

import '@demark-pro/react-booking-calendar/dist/react-booking-calendar.css';
import './BookingsSelectOverride.css';

interface BookingsSelectProps {
  bookings: Day[];
}

export default function BookingsSelect({ bookings }: BookingsSelectProps) {
  const [selectedDates, setSelectedDates] = React.useState<CalendarSelected[]>([]);

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
  return (
    <Calendar selected={selectedDates} reserved={reserved} onChange={setSelectedDates} options={{ weekStartsOn: 1 }} />
  );
}
