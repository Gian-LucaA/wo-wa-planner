"use client";

import * as React from "react";
import PlaceCard from "@/components/placeCard";
import {
  Alert,
  Button,
  ButtonGroup,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalDialog,
  Snackbar,
} from "@mui/joy";
import styles from "./page.module.css";
import UsersSelector from "@/components/usersSelector";
import { useCreatePlace } from "@/hooks/useAddPlace";
import { useGetPlaces } from "@/hooks/useGetPlaces";
import Loader from "@/components/loader";
import ImageUploader from "@/components/imageUploader";
import { redirect } from "next/navigation";

export default function Page() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [places, setPlaces] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "danger"
  >("success");

  const [newPlace, setNewPlace] = React.useState({
    name: "",
    location: "",
    id: "",
    img: File,
    users: [],
  });

  const handleFieldChange = (field: string, value: string) => {
    setNewPlace({ ...newPlace, [field]: value });
  };

  React.useEffect(() => {
    const fetchPlaces = async () => {
      const places = await useGetPlaces();
      setPlaces(places);
      setIsLoading(false);
    };

    fetchPlaces();
  }, []);

  const handleCreateNewPlace = async (newPlace) => {
    const response = await useCreatePlace(
      newPlace.name,
      newPlace.location,
      newPlace._id,
      newPlace.users
    );

    setSnackbarMessage(response.error);
    if (response.success) {
      setPlaces([...places, newPlace]);
      setSnackbarSeverity("success");
      setOpen(false);
    } else {
      setSnackbarSeverity("danger");
    }
    setSnackbarOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  const placeCards = places?.map((place, index) => {
    return (
      <Grid key={index}>
        <PlaceCard
          name={place.name}
          location={place.location}
          id={index.toString()}
          currentlyOccupied={false}
          onClick={() => {
            window.location.href = `/places/${place._id.$oid}`;
          }}
        />
      </Grid>
    );
  });

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog color="primary" variant="plain">
          <div>
            <DialogTitle id="modal-title">Neuen Ort hinzufügen</DialogTitle>
            <DialogContent>
              Fülle die Informationen aus um einen neuen Ort hinzuzufügen.
            </DialogContent>
            <div style={{ margin: "20px" }} />
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Namen eingeben ..."
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </FormControl>
            <div style={{ margin: "20px" }} />
            <FormControl>
              <FormLabel>Ort</FormLabel>
              <Input
                placeholder="Ort eingeben ..."
                onChange={(e) => handleFieldChange("location", e.target.value)}
              />
            </FormControl>
            <div style={{ margin: "20px" }} />
            <FormControl>
              <FormLabel>Nutzer</FormLabel>
              <UsersSelector
                onChange={(users) => handleFieldChange("users", users)}
              />
            </FormControl>
            <div style={{ margin: "20px" }} />
            <FormControl>
              <FormLabel>Bild</FormLabel>
              <ImageUploader />
            </FormControl>
            <div style={{ margin: "20px" }} />
            <ButtonGroup
              spacing={1}
              color="primary"
              className={styles.buttonGroup}
            >
              <Button onClick={() => setOpen(false)} variant="outlined">
                Abbrechen
              </Button>
              <Button
                variant="solid"
                disabled={newPlace.name === "" || newPlace.location === ""}
                onClick={() => {
                  handleCreateNewPlace(newPlace);
                }}
              >
                Speichern
              </Button>
            </ButtonGroup>
          </div>
        </ModalDialog>
      </Modal>
      <Grid
        container
        className={styles.container}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ flexGrow: 1 }}
      >
        {placeCards}
        <Grid key={"add Place"}>
          <PlaceCard
            add
            name="Neuer Ort"
            location="Einen weiteren Ort konfigurieren."
            id="add Place"
            currentlyOccupied={false}
            onClick={() => setOpen(true)}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        color={snackbarSeverity}
        variant="solid"
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}
