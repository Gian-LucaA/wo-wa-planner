import { GET_USERS_BY_ID, GET_USERS } from '../../paths';

export const useGetUsers = (userId?: string) => {
  const url = userId ? GET_USERS_BY_ID(userId) : GET_USERS;

  const users = fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          // Session-Cookie wird serverseitig verwaltet

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
