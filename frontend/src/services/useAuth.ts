import { useState } from 'react';
import Cookies from 'js-cookie';
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
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setInfo(data.message);
        Cookies.set('session_id', data.session_id, {
          expires: 1,
          secure: false,
          sameSite: 'Strict',
          path: '/',
        });
        Cookies.set('username', data.username, {
          expires: 1,
          secure: false,
          sameSite: 'Strict',
          path: '/',
        });
        localStorage.setItem('is_otp_session', data.is_otp_session ? 'true' : 'false');
        return true;
      } else {
        Cookies.remove('session_id');
        Cookies.remove('username');
        setError(data.error || 'Ein unbekannter Fehler ist aufgetreten.');
        return false;
      }
    } catch (error) {
      Cookies.remove('session_id');
      Cookies.remove('username');
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
