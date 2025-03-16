import * as React from "react";
import {
  Alert,
  LinearProgress,
  Stack,
} from "@mui/joy";

export default function Loader() {
  return (
    <Alert color="primary">
      <Stack direction="column" spacing={2} style={{ width: "100%" }}>
        <p style={{ marginBottom: "-10px" }}>Daten werden geladen ...</p>
        <LinearProgress />
      </Stack>
    </Alert>
  );
}
