'use client';
import { UPDATE_USERS } from '../../paths';

export const useUpdateUser = (id: string, username: string, user_tag: string, email: string, color: number) => {
  const success = fetch(UPDATE_USERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id, username, user_tag, email, color }),
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
