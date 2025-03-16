import * as React from "react";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import Key from "@mui/icons-material/Key";
import { Link } from "@mui/joy";

interface PasswordInputProps {
  showMeter?: boolean;
  password: string;
  setPassword: (password: string) => void;
}

export default function PasswordInput({
  showMeter = false,
  password,
  setPassword,
}: PasswordInputProps) {
  const minLength = 12;
  return (
    <Stack spacing={0.5} sx={{ "--hue": Math.min(password.length * 10, 120) }}>
      <Input
        type="password"
        placeholder="Passwort"
        startDecorator={<Key />}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {showMeter && (
        <LinearProgress
          determinate
          size="sm"
          value={Math.min((password.length * 100) / minLength, 100)}
          sx={{
            bgcolor: "background.level3",
            color: "hsl(var(--hue) 80% 40%)",
          }}
        />
      )}
      <Stack direction="row" justifyContent="end" alignItems="center">
        {!showMeter && (
          <Link
            href="/register"
            level="body-sm"
            sx={{ alignSelf: "flex-start" }}
          >
            Passwort Vergessen?
          </Link>
        )}
        {showMeter && (
          <Typography
            level="body-sm"
            sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
          >
            {password.length < 3 && "sehr schwach"}
            {password.length >= 3 && password.length < 6 && "schwach"}
            {password.length >= 6 && password.length < 10 && "stark"}
            {password.length >= 10 && "sehr stark"}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
