"use client";

import * as React from "react";
import { Button, Stack } from "@mui/joy";
import { redirect } from "next/navigation";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Stack
        direction="column"
        spacing={2}
        className={styles.container}
        sx={{
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <h1 className={styles.header}>Seite über Bord!</h1>
        <h2 className={styles.text}>
          Leider ist die gewünschte Seite über Bord gegangen.
          <br />
          Die Robbe hat sie auch nicht gesehen.
        </h2>
        <Button onClick={() => redirect("/")}>Zurück</Button>
      </Stack>
    </div>
  );
}
