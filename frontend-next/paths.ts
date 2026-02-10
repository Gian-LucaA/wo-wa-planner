const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

// Users API paths
export const USERS = `${API_BASE}/users`;
export const ACCEPT_USERS = `${API_BASE}/users/acceptUser`;
export const DECLINE_USERS = `${API_BASE}/users/declineUser`;
export const DELETE_USERS = `${API_BASE}/users/deleteUser`;
export const UPDATE_USERS = `${API_BASE}/users/updateUser`;
export const GET_PENDING_USERS = `${API_BASE}/users/getPendingUsers`;
export const GET_USERS = `${API_BASE}/users/getUsers`;
export const GET_USERS_BY_NAME = (searched: string) => `${GET_USERS}?searched=${searched}`;
export const GET_USERS_BY_ID = (userId: string) => `${GET_USERS}?userId=${userId}`;

// Place API paths
export const PLACES = `${API_BASE}/places`;
export const CREATE_BOOKING = `${PLACES}/createBooking`;
export const CREATE_PLACE = `${PLACES}/createPlace`;
export const PLACE_ADD_IMAGE = `${PLACES}/addImage`;
export const UPDATE_PLACE = `${PLACES}/updatePlace`;
export const GET_PLACES = `${PLACES}/getPlaces`;
export const DELETE_BOOKING = `${PLACES}/deleteBooking`;
export const GET_PLACES_BY_ID = (placeId: string) => `${PLACES}/getPlaces?placeId=${placeId}`;
export const GET_USERS_BOOKINGS = (placeId: string) => `${PLACES}/getUsersBookings?placeId=${placeId}`;
export const GET_BOOKINGS = (year: number, placeId: string) => `${PLACES}/getBookings?year=${year}&placeId=${placeId}`;

// Auth API paths
export const AUTH = `${API_BASE}/auth`;
export const AUTH_LOGIN = `${AUTH}/login`;
export const AUTH_REGISTER = `${AUTH}/register`;
export const AUTH_TOKEN_CHECK = `${AUTH}/checkToken`;
export const AUTH_TOKEN_IS_ADMIN = `${AUTH}/checkIfAdmin`;
export const REFRESH_TOKEN = `${AUTH}/refreshToken`;
export const UPDATE_PASSWORD = `${AUTH}/updatePassword`;
export const SET_OTP = `${AUTH}/setOtp`;
