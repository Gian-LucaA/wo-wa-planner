'use client';

import { getMonths, Month } from '@/helpers/calendar/dateUtils';
import { Card, IconButton, Stack, Typography } from '@mui/joy';
import * as React from 'react';
import MonthBar from './monthBar';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddBookingModal from './addBookingModal';
import { useGetBookings } from '@/hooks/useGetBookings';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import Loader from '../loader';

interface BookingsProps {
  placeId?: string;
}

export default function Bookings({ placeId }: BookingsProps) {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [bookings, setBookings] = React.useState([]);
  const [months, setMonths] = React.useState(() => getMonths(year));
  const [updateIdx, setUpdateIdx] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBookings = async () => {
      if (!placeId) {
        console.error('Place ID is not defined');
        return;
      }

      const bookingsData = await useGetBookings(year, placeId);
      bookingsData.map((booking: any) => {
        const startDate = new Date(parseInt(booking.from.$date.$numberLong, 10));
        const endDate = new Date(parseInt(booking.to.$date.$numberLong, 10));
        booking.startDate = startDate;
        booking.endDate = endDate;
      });
      setBookings(bookingsData);
      setLoading(false);
    };

    fetchBookings();
  }, [year, placeId, updateIdx]);

  React.useEffect(() => {
    setMonths(getMonths(year));
  }, [year]);

  const switchMonthVisibility = (month: Month) => {
    const updatedMonths = months.months.map((m) => (m.index === month.index ? { ...m, disabled: !m.disabled } : m));
    setMonths({
      months: [...updatedMonths],
      hasDisabledMonth: updatedMonths.some((m) => m.disabled),
    });
  };

  const showAllMonths = () => {
    const updatedMonths = months.months.map((m) => ({ ...m, disabled: false }));
    setMonths({
      months: [...updatedMonths],
      hasDisabledMonth: false,
    });
  };

  const location = 'Wohn Wagen';

  return (
    <>
      <AddBookingModal
        placeId={placeId}
        year={year}
        open={addModalOpen}
        setOpen={setAddModalOpen}
        bookings={bookings}
        updateIdx={() => setUpdateIdx(updateIdx + 1)}
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'center',
          '@media (max-width: 600px)': {
            justifyContent: 'space-between',
            marginLeft: '-15px',
          },
          alignItems: 'center',
          position: 'sticky',
          top: '10px',
          zIndex: 1,
        }}
      >
        <Card
          variant="plain"
          size="sm"
          orientation="horizontal"
          sx={{
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
            position: 'absolute',
            left: 0,
            height: '100%',

            '@media (max-width: 600px)': {
              display: 'none',
            },
          }}
        >
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {location}
          </Typography>
        </Card>
        <Card
          variant="plain"
          size="sm"
          orientation="horizontal"
          sx={{
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
          }}
        >
          <IconButton onClick={() => setYear(year - 1)} variant="soft">
            <NavigateBeforeRoundedIcon />
          </IconButton>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {year}
          </Typography>
          <IconButton onClick={() => setYear(year + 1)} variant="soft">
            <NavigateNextRoundedIcon />
          </IconButton>
        </Card>
        <Card
          variant="plain"
          size="sm"
          orientation="horizontal"
          sx={{
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
            position: 'absolute',
            right: 0,
          }}
        >
          <IconButton onClick={() => setAddModalOpen(true)} variant="soft" color="success">
            <AddRoundedIcon />
          </IconButton>
        </Card>
      </Stack>
      {months.hasDisabledMonth && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              overflow: 'auto',
              width: 'calc(100% - 50px)',
              margin: '0 -10px',
              padding: '12px 10px 0 10px',
              scrollbarColor: 'rgba(220, 220, 220, 0.8) transparent',
              scrollbarWidth: 'thin',
              maskImage: 'linear-gradient(to right, transparent 0px, black 10px, black calc(100% - 10px), transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0px, black 10px, black calc(100% - 10px), transparent)',
            }}
          >
            {months.months.map(
              (month) =>
                month.disabled && (
                  <Card
                    key={month.index}
                    variant="plain"
                    size="sm"
                    onClick={() => {
                      switchMonthVisibility(month);
                    }}
                    sx={{
                      display: 'flex',
                      flexDirection: {
                        xs: 'column',
                        sm: 'row',
                      },
                      width: '100px',
                    }}
                  >
                    <Typography level="title-md" sx={{ width: '80px', padding: '2px' }}>
                      {month.short}
                    </Typography>
                    <IconButton
                      variant="plain"
                      sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                      }}
                    >
                      {month.disabled ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
                    </IconButton>
                  </Card>
                ),
            )}
          </Stack>
          <Card
            key={'hideAll'}
            variant="plain"
            size="sm"
            style={{
              position: 'absolute',
              right: '0',
            }}
            onClick={() => {
              showAllMonths();
            }}
          >
            <IconButton
              variant="plain"
              onClick={() => {
                showAllMonths();
              }}
            >
              <KeyboardDoubleArrowDownRoundedIcon />
            </IconButton>
          </Card>
        </div>
      )}
      {loading ? (
        <Loader />
      ) : (
        <Stack
          direction="column"
          spacing={1}
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          {months.months.map(
            (month) =>
              !month.disabled && (
                <MonthBar
                  key={month.index}
                  month={month}
                  year={year}
                  bookings={bookings}
                  switchMonthVisibility={switchMonthVisibility}
                />
              ),
          )}
        </Stack>
      )}
    </>
  );
}
