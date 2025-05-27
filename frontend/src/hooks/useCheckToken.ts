import Cookies from 'js-cookie';

let isChecking = false;

export const useCheckToken = async () => {
  if (isChecking) {
    return false;
  }

  isChecking = true;
  let valid = false;

  try {
    const response = await fetch('http://backend:8000/api/auth/checkToken', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove('session_id');
        Cookies.remove('username');
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      throw new Error('API error');
    }
    valid = true;
  } catch (error) {
    valid = false;
  } finally {
    isChecking = false;
  }

  return valid;
};
