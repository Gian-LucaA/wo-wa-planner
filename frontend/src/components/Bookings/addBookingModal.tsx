'use client';

import * as React from 'react';
import { Button, Modal, ModalClose, ModalDialog, Snackbar, Typography } from '@mui/joy';
import BookingsSelect from './bookingsSelect';
import { useAddBooking } from '@/services/useAddBooking';

interface AddBookingModalProps {
  placeId?: string;
  year: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  bookings: any[];
  updateIdx: () => void;
}

export default function AddBookingModal({ placeId, open, setOpen, bookings, updateIdx }: AddBookingModalProps) {
  const [selectedDates, setSelectedDates] = React.useState<any[]>([]);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSuccess, setSnackbarSuccess] = React.useState(false);

  const location = 'ufo';

  const createBooking = async () => {
    if (!placeId) {
      console.error('Place ID is not defined');
      return;
    }

    try {
      await useAddBooking(placeId, selectedDates[0], selectedDates[1]);

      setSnackbarMessage('Buchung erfolgreich hinzugefügt!');
      setSnackbarSuccess(true);
      setSnackbarOpen(true);
      updateIdx();
      setOpen(false);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Buchung:', error);
      setSnackbarMessage('Fehler beim Hinzufügen der Buchung.');
      setSnackbarSuccess(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
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
            <BookingsSelect bookings={bookings} selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
          </div>
          <Button onClick={() => createBooking()} disabled={selectedDates.length === 0}>
            Buchen
          </Button>
        </ModalDialog>
      </Modal>

      {/* Snackbar */}
      {snackbarMessage && (
        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          variant="solid"
          color={snackbarSuccess ? 'success' : 'danger'}
        >
          {snackbarMessage}
        </Snackbar>
      )}
    </>
  );
}
