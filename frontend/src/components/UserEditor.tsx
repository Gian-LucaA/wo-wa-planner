import * as React from "react";
import {
  Alert,
  Card,
  CardContent,
  CardOverflow,
  Divider,
  Grid,
  Input,
  Typography,
} from "@mui/joy";
import Loader from "./loader";

interface User {
  _id: string;
  username: string;
  user_tag: string;
  email: string;
  created_at: string;
}

interface UserEditorProps {
  user: User | null;
  setUser: (user: User) => void;
  isLoading: boolean;
}

export default function UserEditor({
  user,
  setUser,
  isLoading = true,
}: UserEditorProps) {
  if (isLoading) {
    return <Loader />;
  }

  if (!user && !isLoading) {
    return <Alert color="danger">Nutzer konnte nicht gefunden werden.</Alert>;
  }

  const [username, setUsername] = React.useState(user.username);
  const [user_tag, setUserTag] = React.useState(user.user_tag);
  const [email, setEmail] = React.useState(user.email);

  const generateUserTag = (username: string): string => {
    let userTag = username.replace(/ /g, "_");
    userTag = userTag.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    userTag = userTag.replace(/[^a-zA-Z_]/g, "").toLowerCase();
    return userTag;
  };

  React.useEffect(() => {
    setUserTag(generateUserTag(username));
  }, [username]);

  React.useEffect(() => {
    setUser({ ...user, username, user_tag, email });
  }, [username, user_tag, email]);

  return (
    <div>
      <h1>Nutzer Editor</h1>
      <p style={{ marginBottom: "15px" }}>
        Hier kann der gewählte Nutzer bearbeitet werden.
      </p>
      <Card
        style={{
          maxWidth: "1000px",
          justifySelf: "center",
          alignSelf: "center",
        }}
        variant="soft"
      >
        <h2>Nutzer: {user.username}</h2>

        <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
          <Grid container spacing={2} sx={{ flexGrow: 1, padding: "15px" }}>
            <Grid xs={6}>
              <p>Nutzername</p>
              <Input
                variant="outlined"
                placeholder="Nicht gesetzt!"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid xs={6}>
              <p>Nutzer Tag</p>
              <Input
                variant="outlined"
                placeholder="Nicht gesetzt!"
                value={user_tag}
                onChange={(e) => setUserTag(e.target.value)}
              />
            </Grid>
            <Grid xs={6}>
              <p>E-Mail</p>
              <Input
                variant="outlined"
                placeholder="Nicht gesetzt!"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
          <Divider inset="context" />
          <CardContent orientation="horizontal">
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ fontWeight: "md" }}
            >
              Erstellt am: {user.created_at}
            </Typography>
          </CardContent>
        </CardOverflow>
      </Card>
    </div>
  );
}
