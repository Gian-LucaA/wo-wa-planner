'use client';

import * as React from 'react';
import SideBar from '@/components/sideBar';
import styles from './page.module.css';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useEffect } from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IconButton, Snackbar, Table } from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import { useGetPlaces } from '@/services/useGetPlaces';
import { Place } from '@/types/Place';
import ResponsiveTableList from '@/components/responsiveTable';

export default function Page() {
  const [places, setPlaces] = React.useState<Place[]>([]);
  const [showSuccessSnack, setShowSuccessSnack] = React.useState(false);
  const [showErrorSnack, setShowErrorSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');

  const buttons = [
    {
      icon: <GroupAddRoundedIcon />,
      label: 'Pending Users',
      link: '/pendingUsers',
    },
    {
      icon: <GroupRoundedIcon />,
      label: 'Users',
      link: '/users',
    },
    {
      icon: <SettingsRoundedIcon />,
      label: 'Settings',
      link: '/settings',
    },
  ];

  const getPlaces = useGetPlaces;

  const fetchPlaces = async () => {
    const places = await getPlaces();
    setPlaces(places);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleEdit = (userId: string) => {
    window.location.href = `/administration/places/${userId}`;
  };

  return (
    <div className={styles.pageContainer}>
      <SideBar buttons={buttons} showBackButton={true} />
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
      <div className={styles.content}>
        <h1>Orte</h1>
        <p>Hier können Orte verwaltet werden.</p>
        <div className="spacer" />
        <ResponsiveTableList
          data={places}
          headerField={{ label: 'Nutzername', render: (u) => u.name }}
          infoFields={[{ label: 'Ort', render: (u) => u.location, necessary: true }]}
          buttons={(p) => [
            <IconButton
              variant="plain"
              color="primary"
              key={p._id.$oid}
              onClick={() => {
                handleEdit(place._id.$oid);
              }}
            >
              <EditRoundedIcon />
            </IconButton>,
          ]}
        />
      </div>
    </div>
  );
}
