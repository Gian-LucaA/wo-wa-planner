import * as React from 'react';
import { Alert, Button, Input, Link, Stack, Typography } from '@mui/joy';
import PasswordMeterInput from './passwordInput';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../services/useAuth';
import { redirect } from 'next/navigation';

interface LoginFormProps {
  setType: (type: 'login' | 'register' | 'resetPassword') => void;
}

export default function LoginForm({ setType }: LoginFormProps) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { authenticate, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authenticate(true, username, password);
    const isOtpSession = localStorage.getItem('is_otp_session');
    if (isOtpSession === 'true') {
      redirect('/user');
    }
    if (success) redirect('/places');
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
      <PasswordMeterInput password={password} setPassword={setPassword} setType={setType} />
      {error && <Alert color="danger">{error}</Alert>}
      <Button onClick={handleSubmit}>Login</Button>
      <Stack direction="row" justifyContent="center" alignItems="center" style={{ paddingBottom: '10px' }}>
        <Typography level="body-sm" sx={{ color: 'hsl(var(--hue) 80% 30%)' }}>
          Neu hier?
        </Typography>

        <Link onClick={() => setType('register')} level="body-sm" style={{ marginLeft: '10px' }}>
          Registriere dich Jetzt!
        </Link>
      </Stack>
    </>
  );
}
