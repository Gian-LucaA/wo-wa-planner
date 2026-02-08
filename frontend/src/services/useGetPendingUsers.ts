import { GET_PENDING_USERS } from '../../paths';

export const useGetPendingUsers = () => {
  const pendingUsers = fetch(GET_PENDING_USERS, {
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
      return data.pendingUsers;
    })
    .catch((err) => {});
  return pendingUsers;
};
