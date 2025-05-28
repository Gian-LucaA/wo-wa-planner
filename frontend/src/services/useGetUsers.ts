import Cookies from 'js-cookie';
import { ApiPaths } from '../../paths';

export const useGetUsers = (userId?: string) => {
  const url = userId ? ApiPaths.GET_USERS_BY_ID(userId) : ApiPaths.GET_USERS;

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
