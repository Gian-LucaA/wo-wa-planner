'use client';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export const useAcceptUser = (id: string) => {
  const success = fetch('http://backend:8000/api/users/acceptUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id }),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('session_id');
          Cookies.remove('username');
          redirect('/');
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
      Cookies.remove('session_id');
      Cookies.remove('username');
      window.location.href = '/';
      return false;
    });
};
