'use client';

import * as React from 'react';
import { Alert, Box, Button, Card, Divider, Input } from '@mui/joy';
import PasswordMeterInput from '../../components/passwordInput';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockClockRoundedIcon from '@mui/icons-material/LockClockRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import styles from './page.module.css';
import { useUpdatePassword } from '@/services/useUpdatePassword';

export default function Page() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordOld, setPasswordOld] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await useUpdatePassword(username, passwordOld, password);
    if (!data.error) {
      setError('');
      window.location.href = '/';
      return;
    }
    setError(data.error);
  };

  return (
    <Box className={styles.page}>
      <Card
        className={styles.card}
        variant="plain"
        sx={{
          width: {
            xs: '100vw',
            sm: 450,
          },
          height: {
            xs: '100vh',
            sm: 'auto',
          },
          borderRadius: {
            xs: 0,
            sm: 10,
          },
        }}
      >
        <h2>Passwort Zurücksetzung</h2>
        <Divider style={{ margin: '5px' }} inset="none" />
        <Input
          type="text"
          placeholder="E-Mail"
          startDecorator={<EmailRoundedIcon />}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          type="password"
          placeholder="Altes Passwort"
          startDecorator={<LockClockRoundedIcon />}
          value={passwordOld}
          onChange={(event) => setPasswordOld(event.target.value)}
        />
        <Divider style={{ margin: '5px' }} inset="none" />
        <PasswordMeterInput
          showMeter={password.length > 0}
          password={password}
          setPassword={setPassword}
          placeholder="Neues Passwort"
          hideForgotPassword
        />
        <Input
          type="password"
          placeholder="Neues Passwort wiederholen"
          startDecorator={<KeyRoundedIcon />}
          value={passwordConfirm}
          color={getPasswordConfirmColor(password, passwordConfirm)}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />
        {error && <Alert color="danger">{error}</Alert>}
        <Button disabled={password.length < 5 || password !== passwordConfirm} onClick={handleSubmit}>
          Neues Passwort setzen
        </Button>
      </Card>
    </Box>
  );
}

function getPasswordConfirmColor(password: string, passwordConfirm: string) {
  if (!password || !passwordConfirm) return 'neutral';
  if (password === passwordConfirm) return 'success';
  return 'danger';
}
