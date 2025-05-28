'use client';

import * as React from 'react';
import { Day } from '@/helpers/calendar/dateUtils';
import { Calendar, CalendarDate, CalendarReserved, CalendarSelected } from '@demark-pro/react-booking-calendar';

import '@demark-pro/react-booking-calendar/dist/react-booking-calendar.css';
import './BookingsSelectOverride.css';
import { Booking } from '@/types/Booking';

interface BookingsSelectProps {
  bookings: Booking[];
  selectedDates: CalendarSelected[];
  setSelectedDates: (dates: CalendarSelected[]) => void;
}

export default function BookingsSelect({ bookings, selectedDates, setSelectedDates }: BookingsSelectProps) {
  const reserved: CalendarReserved[] = bookings.map((booking) => ({
    startDate: booking.startDate!,
    endDate: booking.endDate!,
  }));

  return (
    <Calendar
      selected={selectedDates}
      reserved={reserved}
      onChange={setSelectedDates}
      options={{ weekStartsOn: 1 }}
      range={true}
      protection={true}
    />
  );
}
