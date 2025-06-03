'use client';

import { getDaysInMonth, Month } from '@/helpers/calendar/dateUtils';
import { Card, Grid, IconButton, Stack, Typography } from '@mui/joy';
import * as React from 'react';
import DayCard from './dayCard';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
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
  booking: Booking | null;
}

export default function MonthBar({ month, year, bookings, switchMonthVisibility }: MonthBarProps) {
  const [animating, setAnimating] = React.useState(false);
  const days = getDaysInMonth(month.index, year);

  const daysWithBookings = React.useMemo(() => {
    return days.map((day) => {
      const bookingForDay = bookings.find((booking) => {
        const bookingStart = new Date(booking.startDate).getTime();
        const bookingEnd = new Date(booking.endDate).getTime();
        const dayTime = day.date.getTime();
        return dayTime >= bookingStart && dayTime <= bookingEnd;
      });

      return { ...day, booking: bookingForDay || null };
    });
  }, [bookings, days]);

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
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
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%',
          }}
        >
          <Typography level="title-md" sx={{ width: '80px', padding: '2px' }}>
            {!month.disabled ? month.full : month.short}
          </Typography>

          <Grid
            container
            spacing={1}
            sx={{
              height: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              width: '100%',
              paddingRight: {
                xs: '0',
                sm: '40px',
              },
            }}
          >
            {!month.disabled &&
              !animating &&
              daysWithBookings.map((day) => (
                <Grid key={day.date.toISOString()}>
                  <DayCard key={String(day.day) + 'card'} day={day} />
                </Grid>
              ))}

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
              }}
            >
              {month.disabled ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
            </IconButton>
          </Grid>
        </Card>
      </Stack>
    </>
  );
}
