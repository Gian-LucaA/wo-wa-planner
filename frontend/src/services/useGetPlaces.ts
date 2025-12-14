import Cookies from 'js-cookie';
import { GET_PLACES_BY_ID, GET_PLACES } from '../../paths';

export const useGetPlaces = (placeId?: string) => {
  const pendingUsers = fetch(placeId ? GET_PLACES_BY_ID(placeId) : GET_PLACES, {
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
      return data.places;
    })
    .catch((err) => {
      if (err.status === 401) {
        Cookies.remove('session_id');
        Cookies.remove('username');
        window.location.href = '/';
      }
    });
  return pendingUsers;
};
