'use client';
import { redirect } from 'next/navigation';
import { ACCEPT_USERS } from '../../paths';

export const useAcceptUser = (_id: string) => {
  fetch(ACCEPT_USERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ _id }),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          // Session-Cookie wird serverseitig verwaltet
          redirect('/');
        }
        throw new Error('API error');
      }
      return res.json();
    })
    .then((data) => {
      return true;
    })
    .catch((err) => {});
};
