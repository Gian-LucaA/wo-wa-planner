import Cookies from 'js-cookie';

export const useGetPlaces = () => {
  const pendingUsers = fetch('http://backend:8000/api/places/getPlaces', {
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
