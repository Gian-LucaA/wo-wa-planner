'use client';
import Cookies from 'js-cookie';
import { UPDATE_PLACE } from '../../paths';
import { PlaceUser } from '@/types/PlaceUser';

export const useUpdatePlace = (id: string, name: string, location: string, users: PlaceUser[]) => {
  const formatedUsers = users.map((user) => user.user_tag);
  console.log(users, formatedUsers);
  const success = fetch(UPDATE_PLACE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id, name, location, users: formatedUsers }),
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
