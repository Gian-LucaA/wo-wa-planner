'use client';
import { CREATE_PLACE } from '../../paths';

export const useCreatePlace = (name: string, location: string, imgPath: string, users: { user_tag: string }[]) => {
  const userTags = users.map((user) => user.user_tag);

  const result = fetch(CREATE_PLACE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, location, imgPath, users: userTags }),
  })
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        switch (res.status) {
          case 401:
            // Session-Cookie wird serverseitig verwaltet
            window.location.href = '/';
          case 409:
            return {
              success: false,
              error: 'Dieser Ort existiert bereits! Bitte wähle einen anderen Namen.',
            };
          default:
            return { success: false, error: `API error: ${res.status}` };
        }
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        return { success: true, error: null };
      } else {
        return { success: false, error: data.error || 'Unknown error' };
      }
    })
    .catch((error) => {
      return { success: false, error: error.error || 'Network error' };
    });

  return result;
};
