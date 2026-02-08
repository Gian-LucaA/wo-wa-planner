'use client';
import { DELETE_BOOKING } from '../../paths';

export const useDeleteBooking = (id: string) => {
  const success = fetch(DELETE_BOOKING, {
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
