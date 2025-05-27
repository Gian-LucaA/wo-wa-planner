'use client';
import Cookies from 'js-cookie';

export const useAddBooking = (locationId: string, from: Date, to: Date) => {
  const result = fetch('http://general-alcazar.toastylabs.de/api/places/createBooking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ locationId, from, to }),
  })
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        switch (res.status) {
          case 401:
            Cookies.remove('session_id');
            Cookies.remove('username');
            window.location.href = '/';
          case 409:
            return {
              success: false,
              error: 'Dieser Zeitraum ist bereits verbucht.',
            };
          default:
            return { success: false, error: `API error: ${res.status}` };
        }
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        Cookies.set('session_id', data.session_id, {
          expires: 1,
          secure: false,
          sameSite: 'Strict',
          path: '/',
        });
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
