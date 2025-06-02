'use client';

import * as React from 'react';
import SideBar from '@/components/sideBar';
import styles from './page.module.css';
import SingleBedRoundedIcon from '@mui/icons-material/SingleBedRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useEffect } from 'react';
import { useGetPendingUsers } from '@/services/useGetPendingUsers';
import { IconButton, Snackbar } from '@mui/joy';
import DoneIcon from '@mui/icons-material/Done';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useAcceptUser } from '@/services/useAcceptUser';
import { useDeclineUser } from '@/services/useDeclineUser';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ResponsiveTableList from '@/components/responsiveTable';

interface User {
  _id: ID;
  username: string;
  user_tag: string;
  email: string;
  created_at: string;
}

interface ID {
  $oid: string;
}

export default function Page() {
  const [pendingUsers, setPendingUsers] = React.useState<User[]>([]);
  const [showSuccessSnack, setShowSuccessSnack] = React.useState(false);
  const [showErrorSnack, setShowErrorSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');

  const buttons = [
    {
      icon: <GroupRoundedIcon />,
      label: 'Users',
      link: '/users',
    },
    {
      icon: <SingleBedRoundedIcon />,
      label: 'Places',
      link: '/places',
    },
    {
      icon: <SettingsRoundedIcon />,
      label: 'Settings',
      link: '/settings',
    },
  ];

  const getPendingUsers = useGetPendingUsers;
  const acceptUser = useAcceptUser;
  const declineUser = useDeclineUser;

  const fetchPendingUsers = async () => {
    const users = await getPendingUsers();
    setPendingUsers(users);
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleAccept = async (userId: string) => {
    try {
      await acceptUser(userId);
      setSnackText('Nutzer erfolgreich angenommen.');
      setShowSuccessSnack(true);
      fetchPendingUsers();
    } catch (error) {
      setSnackText('Fehler beim Annehmen des Nutzers.');
      setShowErrorSnack(true);
    }
  };

  const handleDecline = async (userId: string) => {
    if (await declineUser(userId)) {
      setSnackText('Nutzer erfolgreich abgelehnt.');
      setShowSuccessSnack(true);
      fetchPendingUsers();
    } else {
      setSnackText('Fehler beim Ablehnen des Nutzers.');
      setShowErrorSnack(true);
    }
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
        <h1>Nutzer auf der Warteliste</h1>
        <p>Hier kannst du die Nutzer auf der Warteliste annehmen oder ablehnen.</p>
        <div className="spacer" />
        <ResponsiveTableList
          data={pendingUsers}
          headerField={{ label: 'Nutzername', render: (u) => u.username }}
          infoFields={[
            { label: 'Nutzertag', render: (u) => u.user_tag, necessary: false },
            { label: 'E-Mail', render: (u) => u.email, necessary: true },
          ]}
          footerField={{ label: 'Erstellt am', render: (u) => `Erstellt am: ${u.created_at}` }}
          buttons={(u) => [
            <IconButton
              variant="plain"
              color="success"
              key={u._id.$oid}
              onClick={() => {
                handleAccept(u._id.$oid);
              }}
            >
              <DoneIcon />
            </IconButton>,
            <IconButton
              color="danger"
              variant="plain"
              key={u._id.$oid}
              onClick={() => {
                handleDecline(u._id.$oid);
              }}
            >
              <NotInterestedIcon />
            </IconButton>,
          ]}
        />
      </div>
    </div>
  );
}
