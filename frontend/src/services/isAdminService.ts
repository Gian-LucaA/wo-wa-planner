import { AUTH_TOKEN_IS_ADMIN } from '../../paths';

let isChecking = false;

export const isAdminService = async () => {
  if (isChecking) {
    return false;
  }

  isChecking = true;
  let valid = false;

  try {
    const response = await fetch(AUTH_TOKEN_IS_ADMIN, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.log(response);
      if (response.status === 401) {
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
