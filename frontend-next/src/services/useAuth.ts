import { useState } from 'react';
import { AUTH_LOGIN, AUTH_REGISTER } from '../../paths';

export const useAuth = () => {
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const authenticate = async (isLogin: boolean, username: string, password: string, email?: string) => {
    setError('');
    setInfo('');
    const url = isLogin ? AUTH_LOGIN : AUTH_REGISTER;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setInfo(data.message);
        localStorage.setItem('is_otp_session', data.is_otp_session ? 'true' : 'false');
        return true;
      } else {
        setError(data.error || 'Ein unbekannter Fehler ist aufgetreten.');
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Failed to fetch') {
        setError('Konnte keine Verbindung zum Server herstellen.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten.');
      }
      return false;
    }
  };

  return { authenticate, error, info };
};
