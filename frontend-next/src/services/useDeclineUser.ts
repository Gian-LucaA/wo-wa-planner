'use client';
import { DECLINE_USERS } from '../../paths';

export const useDeclineUser = (id: string) => {
  const success = fetch(DECLINE_USERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id }),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          // Session-Cookie wird serverseitig verwaltet

          window.location.href = '/';
        }
        throw new Error('API error');
      }
      return res.json();
    })
    .then((data) => {
      return true;
    })
    .catch((err) => {
      return false;
    });

  return success;
};
