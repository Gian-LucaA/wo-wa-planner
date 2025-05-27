import Cookies from 'js-cookie';

export const useGetUsers = (userId?: string) => {
  const url = userId
    ? `http://general-alcazar.toastylabs.de/api/users/getUsers?userId=${userId}`
    : 'http://general-alcazar.toastylabs.de/api/users/getUsers';

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
