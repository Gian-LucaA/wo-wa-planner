'use client';

import { getMonths } from '@/helpers/calendar/dateUtils';
import { Button, Card, IconButton, Modal, ModalClose, ModalDialog, Stack, Typography } from '@mui/joy';
import * as React from 'react';
import MonthBar from './monthBar';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BookingsSelect from './bookingsSelect';

export default function Bookings() {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const months = getMonths();
  const location = 'Wohn Wagen';

  return (
    <>
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography>Buchung Hinzufügen</Typography>
          Bitte wähle einen Zeitraum in dem du {location} buchen möchtest.
          <div
            style={{
              height: '520px',
              overflow: 'auto',
            }}
          >
            <BookingsSelect bookings={[]} />
          </div>
          <Button>Buchen</Button>
        </ModalDialog>
      </Modal>
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
      <Stack
        direction="column"
        spacing={1}
        sx={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {months.map((month) => (
          <MonthBar key={String(month)} month={month} year={year} />
        ))}
      </Stack>
    </>
  );
}
