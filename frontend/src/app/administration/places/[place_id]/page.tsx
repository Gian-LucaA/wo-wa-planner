'use client';

import * as React from 'react';
import { Table, Select, Option, Typography, Box, Snackbar } from '@mui/joy';
import { usePathname } from 'next/navigation';
import { useGetUsers } from '@/services/useGetUsers';
import { useGetPlaces } from '@/services/useGetPlaces';
import { Place } from '@/types/Place';
import { User } from '@/types/User';
import SideBar from '@/components/sideBar';
import styles from './page.module.css';
import { useUpdatePlace } from '@/services/useUpdatePlace';
import { PlaceUser } from '@/types/PlaceUser';

export default function AssignedUsersPage() {
  const pathname = usePathname();
  const place_id = pathname.split('/').pop();

  const [isLoading, setIsLoading] = React.useState(true);
  const [place, setPlace] = React.useState<Place | null>(null);
  const [selectedUsers, setSelectedUsers] = React.useState<PlaceUser[] | undefined>(undefined);
  const [unselectedUsers, setUnselectedUsers] = React.useState<PlaceUser[] | undefined>(undefined);
  const [showSnack, setShowSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');
  const [success, setSuccess] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (typeof place_id === 'string') {
        const places = await useGetPlaces(place_id);
        setPlace(places[0]);

        const users = await useGetUsers();
        setSelectedUsers(users.filter((user) => places[0].users.includes(user.user_tag)));
        setUnselectedUsers(users.filter((user) => !places[0].users.includes(user.user_tag)));

        setIsLoading(false);
      }
    };

    fetchData();
  }, [place_id]);

  const handleSave = async () => {
    if (place && selectedUsers) {
      const success = await useUpdatePlace(place._id.$oid, place.name, place.location, selectedUsers);
      setSuccess(success);
      if (success) {
        setSnackText('Nutzer erfolgreich hinzugefügt.');
      } else {
        setSnackText('Fehler beim Aktualisieren des Ortes.');
      }
      setShowSnack(true);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Snackbar
        open={showSnack}
        onClose={() => setShowSnack(false)}
        key="updateSnack"
        color={success ? 'success' : 'danger'}
        variant="solid"
      >
        {snackText}
      </Snackbar>

      <SideBar showBackButton showSaveButton onSave={handleSave} buttons={[]} />

      <div className={styles.content}>
        <Typography level="h4" mb={2}>
          Zugeordnete Nutzer
        </Typography>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
            </tr>
          </thead>
          <tbody>
            {selectedUsers?.map((user) => (
              <tr key={user.user_tag}>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Box mt={4}>
          <Typography mb={1}>Nutzer hinzufügen</Typography>
          <Select
            placeholder="Nutzer auswählen"
            onChange={(_, newValue) => {
              if (!newValue) return;
              const userToAdd = unselectedUsers?.find((u) => u.user_tag === newValue);
              console.log(newValue);
              if (userToAdd) {
                setSelectedUsers((prev) => [...(prev || []), userToAdd]);
                setUnselectedUsers((prev) => prev?.filter((u) => u.user_tag !== userToAdd.user_tag));
              }
            }}
          >
            {unselectedUsers?.map((user) => (
              <Option key={user.username} value={user.user_tag}>
                {user.username} ({user.user_tag})
              </Option>
            ))}
          </Select>
        </Box>
      </div>
    </div>
  );
}
