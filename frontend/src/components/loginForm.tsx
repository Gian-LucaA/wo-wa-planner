import * as React from "react";
import { Alert, Button, Input, Link, Stack, Typography } from "@mui/joy";
import PasswordMeterInput from "./passwordInput";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../hooks/useAuth";

interface LoginFormProps {
  setIsLogin: (isLogin: boolean) => void;
}

export default function LoginForm({ setIsLogin }: LoginFormProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { authenticate, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate(true, username, password);
  };

  return (
    <>
      <h2>Login</h2>
      <Input
        type="text"
        placeholder="Nutzername"
        startDecorator={<PersonIcon />}
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <PasswordMeterInput password={password} setPassword={setPassword} />
      {error && <Alert color="danger">{error}</Alert>}
      <Button onClick={handleSubmit}>Login</Button>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ paddingBottom: "10px" }}
      >
        <Typography level="body-sm" sx={{ color: "hsl(var(--hue) 80% 30%)" }}>
          Neu hier?
        </Typography>

        <Link
          onClick={() => setIsLogin(false)}
          level="body-sm"
          style={{ marginLeft: "10px" }}
        >
          Registriere dich Jetzt!
        </Link>
      </Stack>
    </>
  );
}
