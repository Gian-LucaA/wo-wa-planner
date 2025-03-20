'use client';

import * as React from 'react';
import { Day } from '@/helpers/calendar/dateUtils';
import { Card, Chip, Tooltip, Typography } from '@mui/joy';

interface DayCardProps {
  day: Day;
}

export default function DayTooltip({ day }: DayCardProps) {
  const isToday = day.isToday;
  const isPast = day.isPast;

  const dayTooltip = (
    <div style={{ padding: '5px' }}>
      <Typography sx={{ color: 'white', fontSize: '14px' }}>
        <Typography sx={{ fontWeight: '600' }}>{day.weekday}</Typography> der{' '}
        <Typography sx={{ fontWeight: '500', textDecoration: 'underline' }}>
          {day.date.toLocaleDateString('de-DE')}
        </Typography>
      </Typography>
      <div style={{ margin: '10px' }} />
      <Chip size="sm" color="danger" sx={{ fontWeight: 'lg' }}>
        Gebucht
      </Chip>
      <Chip size="sm" color="success" sx={{ fontWeight: 'lg' }}>
        Frei
      </Chip>
    </div>
  );

  return (
    <Tooltip title={dayTooltip} placement="top">
      <Card
        variant="soft"
        size="sm"
        orientation="vertical"
        sx={{
          border: isToday ? '2px solid #1976d2' : 'none',
          opacity: isPast ? 0.5 : 1,
        }}
      >
        <Typography sx={{ justifyContent: 'flex-start', color: isPast ? 'gray' : 'inherit' }}>
          {day.weekdayShort}
        </Typography>
      </Card>
    </Tooltip>
  );
}
