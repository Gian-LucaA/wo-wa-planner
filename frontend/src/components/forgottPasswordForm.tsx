import { Alert, Button, Input, Link, Typography } from '@mui/joy';
import * as React from 'react';
import PasswordMeterInput from './passwordInput';
import PersonIcon from '@mui/icons-material/Person';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { setOtp } from '@/services/setOtp';

interface ForgotPasswordFormProps {
  setType: (type: 'login' | 'register' | 'resetPassword') => void;
}

export default function ForgotPasswordForm({ setType }: ForgotPasswordFormProps) {
  const [username, setUsername] = React.useState('');
  const [email, setMail] = React.useState('');
  const [error, setError] = React.useState('');
  const [info, setInfo] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const res = await setOtp(username, email);
    if (res.error) {
      setIsLoading(false);
      setError(res.error);
      return;
    } else if (res.success) {
      setIsLoading(false);
      setInfo(res.success);
      return;
    }
    setIsLoading(false);
  };

  return (
    <>
      <h2>Passwort Zurücksetzung</h2>
      <Input
        type="text"
        placeholder="Nutzername"
        startDecorator={<PersonIcon />}
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <Input
        type="text"
        placeholder="E-Mail"
        startDecorator={<EmailRoundedIcon />}
        value={email}
        onChange={(event) => {
          setMail(event.target.value);
        }}
      />
      {info && <Alert color="success">{info}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}
      <Button
        loading={isLoading}
        disabled={!username || !email}
        onClick={(evt) => {
          setIsLoading(true);
          handleSubmit(evt);
        }}
      >
        Passwort Zurücksetzten
      </Button>
      <Typography
        level="body-sm"
        style={{ paddingBottom: '10px' }}
        sx={{ alignSelf: 'center', color: 'hsl(var(--hue) 80% 30%)' }}
      >
        <Link
          onClick={() => setType('login')}
          level="body-sm"
          sx={{ alignSelf: 'flex-start' }}
          style={{ marginLeft: '10px' }}
        >
          Zurück zum Login!
        </Link>
      </Typography>
    </>
  );
}
