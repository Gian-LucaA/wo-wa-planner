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
import { IconButton, Snackbar, Table } from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import DeleteDialogModal from '@/components/deleteConfirmation';
import { useDeleteUser } from '@/services/useDeleteUser';

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

  const handleDelete = async (userId: string, user_token: string) => {
    setUserTagToDelete(user_token);
    setUserToDelete(userId);
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Benutzername</TableCell>
                <TableCell>Nutzertag</TableCell>
                <TableCell>E-Mail</TableCell>
                <TableCell>Erstellt am</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!users || users?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Es konnten keine Nutzer gefunden werden.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.user_tag}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.created_at}</TableCell>
                    <TableCell>
                      <IconButton
                        variant="plain"
                        color="primary"
                        onClick={() => {
                          handleEdit(user._id.$oid);
                        }}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                      <IconButton
                        color="danger"
                        variant="plain"
                        onClick={() => {
                          handleDelete(user._id.$oid, user.user_tag);
                        }}
                      >
                        <DeleteForeverRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
