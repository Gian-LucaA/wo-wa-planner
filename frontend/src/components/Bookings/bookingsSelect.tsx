'use client';

import * as React from 'react';
import { Day } from '@/helpers/calendar/dateUtils';
import { Calendar, CalendarSelected } from '@demark-pro/react-booking-calendar';

import '@demark-pro/react-booking-calendar/dist/react-booking-calendar.css';
import './BookingsSelectOverride.css';

interface BookingsSelectProps {
  bookings: Day[];
  selectedDates: CalendarSelected[];
  setSelectedDates: (dates: CalendarSelected[]) => void;
}

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

{
  /* TODO Fix disgusting generated code  */
}
export default function BookingsSelect({ bookings, selectedDates, setSelectedDates }: BookingsSelectProps) {
  return (
    <Calendar
      selected={selectedDates}
      reserved={bookings.map((day) => ({
        startDate: new Date(typeof day === 'string' || typeof day === 'number' || day instanceof Date ? day : day.date),
        endDate: new Date(typeof day === 'string' || typeof day === 'number' || day instanceof Date ? day : day.date),
      }))}
      onChange={setSelectedDates}
      options={{ weekStartsOn: 1 }}
      range={true}
      protection={true}
    />
  );
}
