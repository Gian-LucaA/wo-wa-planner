'use client';

import * as React from 'react';
import { Day } from '@/helpers/calendar/dateUtils';
import { Card, Chip, Tooltip, Typography } from '@mui/joy';
import { DayWithBookings } from './monthBar';
import { getColorByIndex, getStandardBackground } from '@/types/Colors';

interface DayCardProps {
  day: DayWithBookings;
}

export default function DayTooltip({ day }: DayCardProps) {
  const isToday = day.isToday;
  const isPast = day.isPast;
  const isBooked = day.booking !== null;

  const dayTooltip = (
    <div style={{ padding: '5px' }}>
      <Typography sx={{ color: 'white', fontSize: '14px' }}>
        <Typography sx={{ fontWeight: '600' }}>{day.weekday}</Typography> der{' '}
        <Typography sx={{ fontWeight: '500', textDecoration: 'underline' }}>
          {day.date.toLocaleDateString('de-DE')}
        </Typography>
      </Typography>

      <div style={{ margin: '10px' }} />

      {isBooked ? (
        <Typography sx={{ color: 'white', fontSize: '14px' }}>
          <Typography sx={{ fontWeight: '600' }}>Gebucht von:</Typography>{' '}
          <Typography sx={{ fontWeight: '500' }}>{day?.booking?.username ?? ''}</Typography>
          <br />
          <Typography sx={{ fontWeight: '500' }}>
            {day?.booking?.startDate?.toLocaleDateString('de-DE') ?? ''}
          </Typography>
          {' - '}
          <Typography sx={{ fontWeight: '500' }}>{day?.booking?.endDate?.toLocaleDateString('de-DE') ?? ''}</Typography>
        </Typography>
      ) : null}

      <div style={{ margin: '10px' }} />

      {isBooked ? (
        <Chip size="sm" color="danger" sx={{ fontWeight: 'lg' }}>
          Gebucht
        </Chip>
      ) : (
        <Chip size="sm" color="success" sx={{ fontWeight: 'lg' }}>
          Frei
        </Chip>
      )}
    </div>
  );

  return (
    <Tooltip title={dayTooltip} placement="top" enterTouchDelay={0}>
      <div
        style={{
          backgroundColor: getColorByIndex(day?.booking?.user_color, 'bg') ?? getStandardBackground('bg'),
          height: '50px',
          width: '50px',
          color: getColorByIndex(day?.booking?.user_color, 'hex'),
          padding: '1rem',
          borderRadius: '8px',
          transition: 'background-color 0.3s, color 0.3s',
          border: isToday ? '2px solid #1976d2' : 'none',
          opacity: isPast ? 0.5 : 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ justifyContent: 'flex-start', color: isPast ? 'gray' : 'inherit' }}>{day.day}</Typography>
      </div>
    </Tooltip>
  );
}
