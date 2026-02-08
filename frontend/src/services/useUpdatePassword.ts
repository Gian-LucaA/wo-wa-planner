'use client';
import Cookies from 'js-cookie';
import { UPDATE_PASSWORD } from '../../paths';

export const useUpdatePassword = (email: string, oldPassword: string, newPassword: string) => {
  const data = fetch(UPDATE_PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, oldPassword, newPassword }),
  })
    .then((res) => {
      if (!res.ok) {
        console.log(res);
        return res.json();
      } else {
        console.log(res);
        console.log('Password updated successfully');
        // Session-Cookie wird serverseitig verwaltet
        Cookies.remove('is_otp_session');
        window.location.href = '/';
        return res.json();
      }
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });

  return data;
};
