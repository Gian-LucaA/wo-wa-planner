'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { REFRESH_TOKEN } from '../../paths';

export default function SessionChecker() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let activityTimeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const handleActivity = () => {
      setIsActive(true);
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(
        () => {
          setIsActive(false);
          redirect('/');
        },
        5 * 60 * 1000,
      ); // 5 Minuten: 5 * 60 * 1000
    };

    // Attach event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // Wenn ein Session-Cookie existiert, wird es automatisch mitgeschickt (credentials: 'include')
    const hasSession = document.cookie.includes('session_id=');

    if (hasSession) {
      interval = setInterval(
        () => {
          if (isActive) {
            fetch(REFRESH_TOKEN, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            })
              .then((res) => res.json())
              .then(() => {
                // Session-Cookie wird vom Backend per HttpOnly-Cookie aktualisiert
              })
              .catch((err) => {
                console.error(err);
                window.location.href = '/';
              });
          }
        },
        10 * 60 * 1000,
      ); // 10 Minuten 10 * 60 * 1000
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
