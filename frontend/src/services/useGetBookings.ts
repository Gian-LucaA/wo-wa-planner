import Cookies from 'js-cookie';
import { ApiPaths } from '../../paths';

export const useGetBookings = (year: number, placeId: string) => {
  const bookings = fetch(ApiPaths.GET_BOOKINGS(year, placeId), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('session_id');
          Cookies.remove('username');
          window.location.href = '/';
        }
        throw new Error('API error');
      }
      return res.json();
    })
    .then((data) => {
      return data.bookings;
    })
    .catch((err) => {});
  return bookings;
};
