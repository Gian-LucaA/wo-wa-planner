'use client';

// import Cookies from 'js-cookie';
import { PLACE_ADD_IMAGE } from '../../paths';

export const useUploadImage = (place_id: string, image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('place_id', place_id);

  const success = fetch(PLACE_ADD_IMAGE, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/';
        }
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
