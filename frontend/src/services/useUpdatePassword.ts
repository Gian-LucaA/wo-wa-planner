'use client';
import Cookies from 'js-cookie';
import { ApiPaths } from '../../paths';

export const useUpdatePassword = (email: string, oldPassword: string, newPassword: string) => {
  const data = fetch(ApiPaths.UPDATE_PASSWORD, {
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
        Cookies.remove('session_id');
        Cookies.remove('username');
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
