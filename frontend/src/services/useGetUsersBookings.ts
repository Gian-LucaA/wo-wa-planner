import Cookies from 'js-cookie';
import { GET_USERS_BOOKINGS } from '../../paths';

export const useGetUsersBookings = (placeId: string) => {
  const bookings = fetch(GET_USERS_BOOKINGS(placeId), {
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
