import { useState } from 'react';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const authenticate = async (isLogin: boolean, username: string, password: string, email?: string) => {
    setError('');
    setInfo('');
    const url = isLogin ? 'http://backend:8000/api/auth/login' : 'http://backend:8000/api/auth/register';

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
        return true;
      } else {
        throw new Error(data.error || 'Something went wrong');
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
