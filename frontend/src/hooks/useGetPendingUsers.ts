import Cookies from 'js-cookie';

export const useGetPendingUsers = () => {
  const pendingUsers = fetch('https://general-alcazar.toastylabs.de/api/users/getPendingUsers', {
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
      return data.pendingUsers;
    })
    .catch((err) => {});
  return pendingUsers;
};
