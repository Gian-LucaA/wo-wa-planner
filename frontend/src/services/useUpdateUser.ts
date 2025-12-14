'use client';
import Cookies from 'js-cookie';
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
          Cookies.remove('session_id');
          Cookies.remove('username');

          window.location.href = '/';
        }
        throw new Error('API error');
      }
      return res.json();
    })
    .then((data) => {
      Cookies.set('session_id', data.session_id, {
        expires: 1,
        secure: false,
        sameSite: 'Strict',
        path: '/',
      });
      return true;
    })
    .catch((err) => {
      return false;
    });

  return success;
};
