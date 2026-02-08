'use client';
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
