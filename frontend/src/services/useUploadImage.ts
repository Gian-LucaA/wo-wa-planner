'use client';

import Cookies from 'js-cookie';
import { ApiPaths } from '../../paths';

export const useUploadImage = (place_id: string, image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('place_id', place_id);

  const success = fetch(ApiPaths.PLACE_ADD_IMAGE, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('session_id');
          Cookies.remove('username');

          window.location.href = '/';
        }
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
