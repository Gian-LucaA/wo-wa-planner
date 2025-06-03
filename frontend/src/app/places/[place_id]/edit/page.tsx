'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Card, IconButton, Snackbar } from '@mui/joy';
import styles from './page.module.css';
import ResponsiveTableList from '@/components/responsiveTable';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Booking } from '@/types/Booking';
import { useGetUsersBookings } from '@/services/useGetUsersBookings';
import { useDeleteBooking } from '@/services/useDeleteBooking';
import DeleteDialogModal from '@/components/deleteConfirmation';

export default function Page() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [showSuccessSnack, setShowSuccessSnack] = React.useState(false);
  const [showErrorSnack, setShowErrorSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [sortField, setSortField] = React.useState<'startDate' | 'endDate'>('startDate');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [bookingToDelete, setBookingToDelete] = React.useState<Booking | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState<boolean>(false);

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean); // remove empty strings
  const place_id = segments[segments.length - 2];

  const sortedBookings = React.useMemo(() => {
    return [...bookings].sort((a, b) => {
      const aVal = a[sortField]?.getTime?.() ?? 0;
      const bVal = b[sortField]?.getTime?.() ?? 0;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [bookings, sortField, sortDirection]);

  React.useEffect(() => {
    fetchBookings();
  }, [place_id]);

  const fetchBookings = async () => {
    if (!place_id) {
      console.error('Place ID is not defined');
      return;
    }

    const bookingsData = await useGetUsersBookings(place_id);

    bookingsData.map((booking: Booking) => {
      if (!booking?.from?.$date || !booking?.to?.$date) return;

      const startDate = new Date(parseInt(booking.from.$date.$numberLong, 10));
      const endDate = new Date(parseInt(booking.to.$date.$numberLong, 10));
      booking.startDate = startDate;
      booking.endDate = endDate;
    });
    setBookings(bookingsData);
  };

  const handleDelete = async (booking: Booking | null) => {
    console.log(booking);
    if (!booking || !booking._id || !booking._id.$oid) {
      setSnackText('Etwas ist beim löschen schief gegangen!.');
      setShowErrorSnack(true);
      setConfirmModalOpen(false);
      return;
    }
    setBookingToDelete(booking);
    setConfirmModalOpen(true);
  };

  const confirmDeletion = () => {
    return async () => {
      if (!bookingToDelete || !bookingToDelete._id || !bookingToDelete._id.$oid) {
        setSnackText('Etwas ist beim löschen schief gegangen!.');
        setShowErrorSnack(true);
        setConfirmModalOpen(false);
        setBookingToDelete(null);
        return;
      }

      if (await useDeleteBooking(bookingToDelete._id.$oid)) {
        setSnackText('Buchung erfolgreich gelöscht.');
        setShowSuccessSnack(true);
        setConfirmModalOpen(false);
        setBookingToDelete(null);
        fetchBookings();
      } else {
        setSnackText('Fehler beim löschen des Nutzers.');
        setShowErrorSnack(true);
        setConfirmModalOpen(false);
        setBookingToDelete(null);
      }
    };
  };

  const handleSort = (field: keyof Booking) => {
    if (field === 'startDate' || field === 'endDate') {
      setSortField(field);
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }
  };

  return (
    <>
      <Card variant="outlined" size="md" className={styles.card}>
        <Snackbar
          open={showSuccessSnack}
          onClose={() => setShowSuccessSnack(false)}
          key="successSnack"
          color="success"
          variant="solid"
        >
          {snackText}
        </Snackbar>
        <Snackbar
          open={showErrorSnack}
          onClose={() => setShowErrorSnack(false)}
          key="errorSnack"
          color="danger"
          variant="solid"
        >
          {snackText}
        </Snackbar>
        <DeleteDialogModal
          showDeleteDialog={confirmModalOpen}
          setShowDeleteDialog={setConfirmModalOpen}
          handleDeleteConfirmed={confirmDeletion()}
          message={`Möchtest du diesen Eintrag wirklich löschen?\n\nStart: ${bookingToDelete?.startDate?.toLocaleDateString()}\nEnde: ${bookingToDelete?.endDate?.toLocaleDateString()}`}
        />
        <div className={styles.content}>
          <h1>Buchungen</h1>
          <p>Hier kannst du deine Buchungen wieder löschen.</p>
          <div className={styles.scrollContainer}>
            <ResponsiveTableList
              data={sortedBookings}
              headerField={{ label: 'Buchung', render: (u) => 'Buchung' }}
              infoFields={[
                {
                  label: 'Start',
                  render: (b) => b.startDate?.toLocaleDateString(),
                  key: 'startDate',
                  necessary: true,
                  showLabel: true,
                },
                {
                  label: 'Ende',
                  render: (b) => b.endDate?.toLocaleDateString(),
                  key: 'endDate',
                  necessary: true,
                  showLabel: true,
                },
              ]}
              buttons={(b) => [
                <IconButton color="danger" onClick={() => handleDelete(b)} key={b?._id?.$oid}>
                  <DeleteForeverRoundedIcon />
                </IconButton>,
              ]}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
            <div className={styles.fadeTop}></div>
            <div className={styles.fadeBottom}></div>
          </div>
        </div>
      </Card>
    </>
  );
}
