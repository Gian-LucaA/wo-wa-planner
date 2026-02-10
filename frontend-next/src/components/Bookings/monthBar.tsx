'use client';

import { getDaysInMonth, Month } from '@/helpers/calendar/dateUtils';
import { Card, Grid, IconButton, Stack, Typography, Box } from '@mui/joy';
import * as React from 'react';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import DayCard from './dayCard';
import { Booking } from '@/types/Booking';

interface MonthBarProps {
  month: Month;
  year: number;
  bookings: any[];
  switchMonthVisibility: (month: Month) => void;
}

export interface DayWithBookings {
  date: Date;
  day: number;
  weekday: string;
  weekdayShort: string;
  isToday?: boolean;
  isPast?: boolean;
  bookings: Booking[];
  primaryBooking?: Booking;
  primaryBookingMeta?: {
    isStart: boolean;
    isEnd: boolean;
    showLabel: boolean;
  };
}

export default function MonthBar({ month, year, bookings, switchMonthVisibility }: MonthBarProps) {
  const [animating, setAnimating] = React.useState(false);
  const days = getDaysInMonth(month.index, year);

  const daysWithBookings = React.useMemo<DayWithBookings[]>(() => {
    return days.map((day) => {
      const bookingsForDay: Booking[] = (bookings || []).filter((booking) => {
        const bookingStartDate = booking.startDate ? new Date(booking.startDate) : undefined;
        const bookingEndDate = booking.endDate ? new Date(booking.endDate) : undefined;

        if (!bookingStartDate || !bookingEndDate) return false;

        const dayDateString = day.date.toDateString();
        const startDateString = bookingStartDate.toDateString();
        const endDateString = bookingEndDate.toDateString();

        // Eintagesbuchung: Tag muss genau diesem Datum entsprechen
        if (startDateString === endDateString) {
          return dayDateString === startDateString;
        }

        // Mehrtägige Buchung: wie bisher über Zeitstempel abbilden
        const bookingStart = bookingStartDate.getTime();
        const bookingEnd = bookingEndDate.getTime();
        const dayTime = day.date.getTime();
        return dayTime >= bookingStart && dayTime <= bookingEnd;
      });

      return { ...day, bookings: bookingsForDay } as DayWithBookings;
    });
  }, [bookings, days]);

  const daysWithMeta = React.useMemo<DayWithBookings[]>(() => {
    const bookingToIndices = new Map<string, number[]>();

    const getBookingKey = (b: Booking): string => {
      const anyId: any = (b as any)._id;
      if (typeof anyId === 'string') return anyId;
      if (anyId && typeof anyId === 'object') {
        if (typeof anyId.$oid === 'string') return anyId.$oid;
        try {
          return JSON.stringify(anyId);
        } catch {
          // ignore
        }
      }
      return `${b.username ?? 'user'}-${b.placeName}-${b.startDate}-${b.endDate}`;
    };

    daysWithBookings.forEach((day, dayIndex) => {
      (day.bookings || []).forEach((b) => {
        const key = getBookingKey(b);
        if (!bookingToIndices.has(key)) bookingToIndices.set(key, []);
        bookingToIndices.get(key)!.push(dayIndex);
      });
    });

    const perDayMeta = new Map<
      number,
      Map<
        string,
        {
          isStart: boolean;
          isEnd: boolean;
          showLabel: boolean;
        }
      >
    >();

    bookingToIndices.forEach((indices, key) => {
      if (!indices.length) return;
      const first = indices[0];
      const last = indices[indices.length - 1];
      const labelIndex = indices[Math.floor(indices.length / 2)];

      indices.forEach((idx) => {
        const metaForDay = perDayMeta.get(idx) ?? new Map();
        metaForDay.set(key, {
          isStart: idx === first,
          isEnd: idx === last,
          showLabel: idx === labelIndex,
        });
        perDayMeta.set(idx, metaForDay);
      });
    });

    return daysWithBookings.map((day, idx) => {
      if (!day.bookings || day.bookings.length === 0) return day;
      const primary = day.bookings[0];
      const primaryKey = getBookingKey(primary);
      const meta = perDayMeta.get(idx)?.get(primaryKey);

      return {
        ...day,
        primaryBooking: primary,
        primaryBookingMeta: meta,
      } as DayWithBookings;
    });
  }, [daysWithBookings]);

  const weekdayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const firstDayIndex = (daysWithMeta[0]?.date.getDay() + 6) % 7;

  const daysGrid = [...Array(firstDayIndex).fill(null), ...daysWithMeta];

  const firstDayOfMonth = daysWithMeta[0]?.date;
  const lastDayOfMonth = daysWithMeta[daysWithMeta.length - 1]?.date;

  const normalizeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'stretch',
          width: !month.disabled ? '100%' : '100px',
          transition: 'width 0.5s ease-in-out',
        }}
        onTransitionEnd={() => setAnimating(false)}
      >
        <Card
          variant="plain"
          size="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <Typography
            level="title-md"
            sx={{
              width: '100%',
              padding: '8px',
              textAlign: 'start',
              fontWeight: 'bold',
              zIndex: 2,
            }}
          >
            {!month.disabled ? month.full : month.short}
          </Typography>
          <IconButton
            variant="plain"
            onClick={() => {
              switchMonthVisibility(month);
              setAnimating(true);
            }}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 2,
            }}
          >
            {month.disabled ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
          </IconButton>
          <Box
            sx={{
              transition: 'transform 0.2s, width 0.2s',
              transformOrigin: 'center',
              '@media (max-width: 480px)': {
                transform: 'scale(0.85)',
                margin: '-20px',
              },
              '@media (max-width: 440px)': {
                transform: 'scale(0.775)',
                margin: '-30px',
              },
              '@media (max-width: 415px)': {
                transform: 'scale(0.7)',
                margin: '-40px',
              },
            }}
          >
            <Grid
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                width: '100%',
                margin: '0 auto',
                gap: '8px',
              }}
            >
              {weekdayNames.map((name) => (
                <Grid key={name} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {name}
                </Grid>
              ))}

              {!month.disabled &&
                !animating &&
                daysGrid.map((day, idx) => {
                  if (!day) {
                    return <Grid key={'empty-' + idx} />;
                  }

                  const current = day as DayWithBookings;
                  const prev = (idx > 0 ? (daysGrid[idx - 1] as DayWithBookings | null) : null) ?? null;
                  const next =
                    (idx < daysGrid.length - 1 ? (daysGrid[idx + 1] as DayWithBookings | null) : null) ?? null;

                  const isBooked = (current.bookings?.length ?? 0) > 0;
                  const hasBookedLeft = isBooked && !!(prev && (prev.bookings?.length ?? 0) > 0);
                  const hasBookedRight = isBooked && !!(next && (next.bookings?.length ?? 0) > 0);

                  const colIndex = idx % 7;
                  let fadeRightEdge = colIndex === 6 && isBooked && !!(next && (next.bookings?.length ?? 0) > 0);
                  let fadeLeftEdge = colIndex === 0 && isBooked && !!(prev && (prev.bookings?.length ?? 0) > 0);

                  const isFirstOfMonth =
                    !!firstDayOfMonth && current.date.toDateString() === firstDayOfMonth.toDateString();
                  const isLastOfMonth =
                    !!lastDayOfMonth && current.date.toDateString() === lastDayOfMonth.toDateString();

                  if (isFirstOfMonth && isBooked) {
                    const hasBookingFromPreviousMonth = (current.bookings || []).some((b) => {
                      if (!b.startDate) return false;
                      const start = new Date(b.startDate);
                      if (Number.isNaN(start.getTime())) return false;
                      return normalizeDate(start).getTime() < normalizeDate(current.date).getTime();
                    });
                    fadeLeftEdge = fadeLeftEdge || hasBookingFromPreviousMonth;
                  }

                  if (isLastOfMonth && isBooked) {
                    const hasBookingIntoNextMonth = (current.bookings || []).some((b) => {
                      if (!b.endDate) return false;
                      const end = new Date(b.endDate);
                      if (Number.isNaN(end.getTime())) return false;
                      return normalizeDate(end).getTime() > normalizeDate(current.date).getTime();
                    });
                    fadeRightEdge = fadeRightEdge || hasBookingIntoNextMonth;
                  }

                  return (
                    <Grid
                      key={current.date.toISOString()}
                      sx={{
                        ml: hasBookedLeft ? '-4px' : 0,
                        mr: hasBookedRight ? '-4px' : 0,
                      }}
                    >
                      <DayCard
                        key={String(current.day) + 'card'}
                        day={current}
                        hasBookedLeft={hasBookedLeft}
                        hasBookedRight={hasBookedRight}
                        fadeLeftEdge={fadeLeftEdge}
                        fadeRightEdge={fadeRightEdge}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </Card>
      </Stack>
    </>
  );
}
