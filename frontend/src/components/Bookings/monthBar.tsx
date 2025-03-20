'use client';

import { getDaysInMonth, Month } from '@/helpers/calendar/dateUtils';
import { Box, Card, Grid, Stack, Typography } from '@mui/joy';
import * as React from 'react';
import DayCard from './dayCard';

interface MonthBarProps {
  month: Month;
  year: number;
}

export default function MonthBar({ month, year }: MonthBarProps) {
  const days = getDaysInMonth(month.index, year);

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
        }}
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
            {month.full}
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
            }}
          >
            {days.map((day) => (
              <Grid key={day.date.toISOString()} sx={{ width: '50px' }}>
                <DayCard key={String(day.day)} day={day} />
              </Grid>
            ))}
          </Grid>
        </Card>
      </Stack>
    </>
  );
}
