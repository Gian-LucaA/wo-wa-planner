'use client';
import { ApiPaths } from '../../paths';

export const setOtp = async (username: string, email: string) => {
  try {
    const res = await fetch(ApiPaths.SET_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        error: data.error || 'Ein Fehler ist aufgetreten.',
      };
    } else {
      console.log('OTP set successfully');
      return {
        success: data.success || 'Wenn deine E-Mail gefunden wurde, hast du ein neues Passwort per Mail bekommen.',
      };
    }
  } catch {
    return { error: 'Network error' };
  }
};
