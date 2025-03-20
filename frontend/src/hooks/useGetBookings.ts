import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export const useGetBookings = (year: number, placeId: string) => {
  const bookings = fetch(`http://localhost:8080/api/users/getPlaces?year=${year}&placeId=${placeId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          Cookies.remove('session_id');
          Cookies.remove('username');
          redirect('/');
        }
        throw new Error('API error');
      }
      return res.json();
    })
    .then((data) => {
      return data.pendingUsers;
    })
    .catch((err) => {});
  return bookings;
};
