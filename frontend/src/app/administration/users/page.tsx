'use client';

import * as React from 'react';
import SideBar from '@/components/sideBar';
import styles from './page.module.css';
import SingleBedRoundedIcon from '@mui/icons-material/SingleBedRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import { useEffect } from 'react';
import { useGetUsers } from '@/services/useGetUsers';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IconButton, Snackbar, Table, useTheme } from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import DeleteDialogModal from '@/components/deleteConfirmation';
import { useDeleteUser } from '@/services/useDeleteUser';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  const [users, setUsers] = React.useState<User[]>([]);
  const [showSuccessSnack, setShowSuccessSnack] = React.useState(false);
  const [showErrorSnack, setShowErrorSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState('');

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [userTagToDelete, setUserTagToDelete] = React.useState<string>('');
  const [userToDelete, setUserToDelete] = React.useState<string>('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const buttons = [
    {
      icon: <GroupAddRoundedIcon />,
      label: 'Pending Users',
      link: '/pendingUsers',
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

  const handleDelete = async (userId: string, user_token: string) => {
    setUserTagToDelete(user_token);
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirmed = (userId: string) => {
    return async () => {
      if (await useDeleteUser(userId)) {
        setSnackText('Nutzer erfolgreich gelöscht.');
        setShowSuccessSnack(true);
        fetchUsers();
      } else {
        setSnackText('Fehler beim löschen des Nutzers.');
        setShowErrorSnack(true);
      }
    };
  };

  const handleEdit = (userId: string) => {
    window.location.href = `/administration/users/${userId}`;
  };

  const fetchUsers = async () => {
    const users = await useGetUsers();
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      <DeleteDialogModal
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        confirmation={userTagToDelete}
        handleDeleteConfirmed={handleDeleteConfirmed(userToDelete)}
      />

      <div className={styles.content}>
        <h1>Akzeptierte Nutzer</h1>
        <p>Hier kannst du die Nutzer akzeptierten Nutzer verwalten.</p>
        <div className="spacer" />
        <ResponsiveTableList
          data={users}
          headerField={{ label: 'Nutzername', render: (u) => u.username }}
          infoFields={[
            { label: 'Nutzertag', render: (u) => u.user_tag, necessary: false },
            { label: 'E-Mail', render: (u) => u.email, necessary: true },
          ]}
          footerField={{ label: 'Erstellt am', render: (u) => `Erstellt am: ${u.created_at}` }}
          buttons={(u) => [
            <IconButton color="primary" onClick={() => handleEdit(u._id.$oid)} key={u._id.$oid}>
              <EditRoundedIcon />
            </IconButton>,
            <IconButton color="danger" onClick={() => handleDelete(u._id.$oid, u.user_tag)} key={u._id.$oid}>
              <DeleteForeverRoundedIcon />
            </IconButton>,
          ]}
        />
      </div>
    </div>
  );
}
