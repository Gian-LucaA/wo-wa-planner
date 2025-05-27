import Cookies from 'js-cookie';

export const useFetchUsers = (searched?: string) => {
  const url = `http://localhost:8080/api/users/getUsers?searched=${searched}`;

  const users = fetch(url, {
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
      return data.users;
    })
    .catch((err) => {});
  return users;
};
