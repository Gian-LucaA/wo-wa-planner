import { Alert, Button, Input, Link, Typography } from '@mui/joy';
import * as React from 'react';
import PasswordMeterInput from './passwordInput';
import PersonIcon from '@mui/icons-material/Person';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { useAuth } from '../services/useAuth';

interface RegisterFormProps {
  setIsLogin: (isLogin: boolean) => void;
}

export default function RegisterForm({ setIsLogin }: RegisterFormProps) {
  const [username, setUsername] = React.useState('');
  const [email, setMail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { authenticate, error, info } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate(false, username, password, email);
  };

  return (
    <>
      <h2>Registrieren</h2>
      <Input
        type="text"
        placeholder="Nutzername"
        startDecorator={<PersonIcon />}
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <Input
        type="text"
        placeholder="E-Mail"
        startDecorator={<EmailRoundedIcon />}
        value={email}
        onChange={(event) => setMail(event.target.value)}
      />
      <PasswordMeterInput showMeter password={password} setPassword={setPassword} />
      {info && <Alert color="success">{info}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}
      <Button onClick={handleSubmit}>Warteliste beitreten</Button>
      <Typography
        level="body-sm"
        style={{ paddingBottom: '10px' }}
        sx={{ alignSelf: 'center', color: 'hsl(var(--hue) 80% 30%)' }}
      >
        Bereits einen Account?
        <Link
          onClick={() => setIsLogin(true)}
          level="body-sm"
          sx={{ alignSelf: 'flex-start' }}
          style={{ marginLeft: '10px' }}
        >
          Zum Login!
        </Link>
      </Typography>
    </>
  );
}
