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
}

export default function MonthBar({ month, year, bookings, switchMonthVisibility }: MonthBarProps) {
  const [animating, setAnimating] = React.useState(false);
  const days = getDaysInMonth(month.index, year);

  const daysWithBookings = React.useMemo(() => {
    return days.map((day) => {
      const bookingsForDay: Booking[] = (bookings || []).filter((booking) => {
        const bookingStart = booking.startDate ? new Date(booking.startDate).getTime() : undefined;
        const bookingEnd = booking.endDate ? new Date(booking.endDate).getTime() : undefined;
        if (bookingStart === undefined || bookingEnd === undefined) return false;
        const dayTime = day.date.getTime();
        return dayTime >= bookingStart && dayTime <= bookingEnd;
      });

      return { ...day, bookings: bookingsForDay };
    });
  }, [bookings, days]);

  const weekdayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const firstDayIndex = (daysWithBookings[0]?.date.getDay() + 6) % 7;

  const daysGrid = [...Array(firstDayIndex).fill(null), ...daysWithBookings];

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
                daysGrid.map((day, idx) =>
                  day ? (
                    <Grid key={day.date.toISOString()}>
                      <DayCard key={String(day.day) + 'card'} day={day} />
                    </Grid>
                  ) : (
                    <Grid key={'empty-' + idx} />
                  ),
                )}
            </Grid>
          </Box>
        </Card>
      </Stack>
    </>
  );
}
