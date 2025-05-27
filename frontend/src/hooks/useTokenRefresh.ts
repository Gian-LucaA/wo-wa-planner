'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export default function SessionChecker() {
  const [isActive, setIsActive] = useState(false);
  const sessionId = Cookies.get('session_id');

  useEffect(() => {
    let activityTimeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const handleActivity = () => {
      setIsActive(true);
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        setIsActive(false);
        Cookies.remove('session_id');
        Cookies.remove('username');
        redirect('/');
      }, 5 * 60 * 1000); // 5 Minuten: 5 * 60 * 1000
    };

    // Attach event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    if (sessionId) {
      interval = setInterval(() => {
        if (isActive) {
          fetch('http://general-alcazar.toastylabs.de/api/auth/refreshToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((data) => {
              Cookies.set('session_id', data.session_id, {
                expires: 1,
                secure: false,
                sameSite: 'Strict',
                path: '/',
              });
            })
            .catch((err) => {
              console.error(err);
              Cookies.remove('session_id');
              Cookies.remove('username');

              window.location.href = '/';
            });
        }
      }, 10 * 60 * 1000); // 10 Minuten 10 * 60 * 1000
    }

    return () => {
      clearTimeout(activityTimeout);
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isActive]);

  return null;
}
