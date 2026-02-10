'use client';
import { CREATE_BOOKING } from '../../paths';

export const useAddBooking = (locationId: string, from: Date, to: Date) => {
  const result = fetch(CREATE_BOOKING, {
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
            // Session-Cookie wird serverseitig verwaltet
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
