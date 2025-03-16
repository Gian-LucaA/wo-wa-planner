"use client";

import * as React from "react";
import SideBar from "@/components/sideBar";
import styles from "./page.module.css";
import SingleBedRoundedIcon from "@mui/icons-material/SingleBedRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useEffect } from "react";
import { useGetPendingUsers } from "@/hooks/useGetPendingUsers";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IconButton, Snackbar, Table } from "@mui/joy";
import DoneIcon from "@mui/icons-material/Done";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { useAcceptUser } from "@/hooks/useAcceptUser";
import { useDeclineUser } from "@/hooks/useDeclineUser";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

interface User {
  _id: string;
  username: string;
  user_tag: string;
  email: string;
  created_at: string;
}

export default function Page() {
  const [pendingUsers, setPendingUsers] = React.useState<User[]>([]);
  const [showSuccessSnack, setShowSuccessSnack] = React.useState(false);
  const [showErrorSnack, setShowErrorSnack] = React.useState(false);
  const [snackText, setSnackText] = React.useState("");

  const buttons = [
    {
      icon: <GroupRoundedIcon />,
      label: "Users",
      link: "/users",
    },
    {
      icon: <SingleBedRoundedIcon />,
      label: "Places",
      link: "/places",
    },
    {
      icon: <SettingsRoundedIcon />,
      label: "Settings",
      link: "/settings",
    },
  ];

  const fetchPendingUsers = async () => {
    const users = await useGetPendingUsers();
    setPendingUsers(users);
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleAccept = async (userId: string) => {
    if (await useAcceptUser(userId)) {
      setSnackText("Nutzer erfolgreich angenommen.");
      setShowSuccessSnack(true);
      fetchPendingUsers();
    } else {
      setSnackText("Fehler beim Annehmen des Nutzers.");
      setShowErrorSnack(true);
    }
  };

  const handleDecline = async (userId: string) => {
    if (await useDeclineUser(userId)) {
      setSnackText("Nutzer erfolgreich abgelehnt.");
      setShowSuccessSnack(true);
      fetchPendingUsers();
    } else {
      setSnackText("Fehler beim Ablehnen des Nutzers.");
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
        <p>
          Hier kannst du die Nutzer auf der Warteliste annehmen oder ablehnen.
        </p>
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
              {!pendingUsers || pendingUsers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Keine Nutzer auf der Warteliste.
                  </TableCell>
                </TableRow>
              ) : (
                pendingUsers.map((user) => (
                  <TableRow key={user.user_tag}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.user_tag}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.created_at}</TableCell>
                    <TableCell>
                      <IconButton
                        variant="plain"
                        color="success"
                        onClick={() => {
                          handleAccept(user._id.$oid);
                        }}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        color="danger"
                        variant="plain"
                        onClick={() => {
                          handleDecline(user._id.$oid);
                        }}
                      >
                        <NotInterestedIcon />
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
