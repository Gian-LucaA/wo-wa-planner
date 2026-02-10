'use client';

import * as React from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/joy';
import { DayWithBookings } from './monthBar';
import { getColorByIndex, getStandardBackground } from '@/types/Colors';

interface DayCardProps {
  day: DayWithBookings;
  hasBookedLeft?: boolean;
  hasBookedRight?: boolean;
  fadeLeftEdge?: boolean;
  fadeRightEdge?: boolean;
}

export default function DayTooltip({ day, hasBookedLeft, hasBookedRight, fadeLeftEdge, fadeRightEdge }: DayCardProps) {
  const isToday = day.isToday;
  const isPast = day.isPast;
  const isBooked = (day.bookings?.length ?? 0) > 0;
  const bookingCount = day.bookings?.length ?? 0;

  const singleBgColor =
    bookingCount === 1
      ? (getColorByIndex(day.bookings?.[0]?.user_color, 'bg') ?? getStandardBackground('bg'))
      : getStandardBackground('bg');

  const gradientBg = React.useMemo(() => {
    if (bookingCount !== 2) return undefined as string | undefined;
    const c1 = getColorByIndex(day.bookings?.[0]?.user_color, 'bg') ?? getStandardBackground('bg');
    const c2 = getColorByIndex(day.bookings?.[1]?.user_color, 'bg') ?? getStandardBackground('bg');
    // Diagonale Teilung: oben links c1, unten rechts c2
    return `linear-gradient(135deg, ${c1} 0%, ${c1} 50%, ${c2} 50%, ${c2} 100%)`;
  }, [bookingCount, day.bookings]);

  const gradientText = React.useMemo(() => {
    if (bookingCount !== 2) return undefined as string | undefined;
    const t1 = getColorByIndex(day.bookings?.[0]?.user_color, 'hex') ?? '#000000';
    const t2 = getColorByIndex(day.bookings?.[1]?.user_color, 'hex') ?? '#000000';
    return `linear-gradient(135deg, ${t1} 0%, ${t1} 50%, ${t2} 50%, ${t2} 100%)`;
  }, [bookingCount, day.bookings]);

  const numberSx = React.useMemo(() => {
    if (isPast) return { color: 'gray' } as any;
    if (bookingCount === 2)
      return {
        background: gradientText,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
      } as any;
    if (bookingCount === 1) return { color: getColorByIndex(day.bookings?.[0]?.user_color, 'hex') } as any;
    return {} as any;
  }, [bookingCount, gradientText, isPast, day.bookings]);

  const formatDate = (d?: Date | string) => {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('de-DE');
  };

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
          {(day.bookings || []).map((b, i) => (
            <span key={`${day.date.toISOString()}-${i}`}>
              <Typography sx={{ fontWeight: '600' }}>Gebucht von: </Typography>
              <Typography sx={{ fontWeight: '500' }}>{b.username ?? ''}</Typography>
              <br />
              <Typography sx={{ fontWeight: '500' }}>{formatDate(b.startDate)}</Typography>
              {' - '}
              <Typography sx={{ fontWeight: '500' }}>{formatDate(b.endDate)}</Typography>
              <br />
            </span>
          ))}
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

  const borderRadius = React.useMemo(() => {
    if (!isBooked) return '8px';
    const baseRadius = 8;
    const leftRadius = hasBookedLeft ? 0 : baseRadius;
    const rightRadius = hasBookedRight ? 0 : baseRadius;
    return `${leftRadius}px ${rightRadius}px ${rightRadius}px ${leftRadius}px`;
  }, [isBooked, hasBookedLeft, hasBookedRight]);

  return (
    <Tooltip title={dayTooltip} placement="top" enterTouchDelay={0}>
      <Box
        sx={(theme) => ({
          ...(bookingCount === 2 ? { background: gradientBg } : { backgroundColor: singleBgColor }),
          height: '50px',
          width: isBooked ? '100%' : '50px',
          color: bookingCount === 1 ? getColorByIndex(day.bookings?.[0]?.user_color, 'hex') : undefined,
          padding: '1rem',
          borderRadius,
          transition: 'background-color 0.3s, color 0.3s',
          border: isToday ? '2px solid #1976d2' : 'none',
          opacity: isPast ? 0.5 : 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          ...(fadeRightEdge && {
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '16px',
              height: '100%',
              pointerEvents: 'none',
              background: `linear-gradient(to right, rgba(0,0,0,0), ${theme.vars.palette.background.body})`,
              opacity: 0.8,
            },
          }),
          ...(fadeLeftEdge && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '16px',
              height: '100%',
              pointerEvents: 'none',
              background: `linear-gradient(to left, rgba(0,0,0,0), ${theme.vars.palette.background.body})`,
              opacity: 0.8,
            },
          }),
        })}
      >
        <Typography sx={{ justifyContent: 'flex-start', ...numberSx }}>{day.day}</Typography>
        {bookingCount > 2 ? (
          <span
            style={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              right: 4,
              display: 'flex',
              gap: 4,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {day.bookings?.slice(0, 4).map((b, i) => (
              <span
                key={`dot-${i}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: getColorByIndex(b.user_color, 'hex'),
                  display: 'inline-block',
                }}
              />
            ))}
            {bookingCount > 4 ? (
              <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.6)' }}>+{bookingCount - 4}</span>
            ) : null}
          </span>
        ) : null}
      </Box>
    </Tooltip>
  );
}
