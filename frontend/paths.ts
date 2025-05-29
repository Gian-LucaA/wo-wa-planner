export class ApiPaths {
  // Basis-API-Pfad
  public static readonly BASE_PATH = process.env.NEXT_PUBLIC_API_URL;

  // Users API paths
  public static readonly USERS = `${this.BASE_PATH}/users`;
  public static readonly ACCEPT_USERS = `${this.USERS}/acceptUser`;
  public static readonly DECLINE_USERS = `${this.USERS}/declineUser`;
  public static readonly DELETE_USERS = `${this.USERS}/deleteUser`;
  public static readonly UPDATE_USERS = `${this.USERS}/updateUser`;
  public static readonly GET_PENDING_USERS = `${this.USERS}/getPendingUsers`;
  public static readonly GET_USERS = `${this.USERS}/getUsers`;
  public static readonly GET_USERS_BY_NAME = (searched: string) =>
    `${this.USERS}${this.GET_USERS}?searched=${searched}`;
  public static readonly GET_USERS_BY_ID = (userId: string) => `${this.USERS}${this.GET_USERS}?userId=${userId}`;

  // Place API paths
  public static readonly PLACES = `${this.BASE_PATH}/places`;
  public static readonly CREATE_BOOKING = `${this.PLACES}/createBooking`;
  public static readonly CREATE_PLACE = `${this.PLACES}/createBooking`;
  public static readonly PLACE_ADD_IMAGE = `${this.PLACES}/addImage`;
  public static readonly GET_PLACES = `${this.PLACES}/getPlaces`;
  public static readonly GET_BOOKINGS = (year: number, placeId: string) =>
    `${this.PLACES}/getBookings?year=${year}&placeId=${placeId}`;

  // Auth API paths
  public static readonly AUTH = `${this.BASE_PATH}/auth`;
  public static readonly AUTH_LOGIN = `${this.AUTH}/login`;
  public static readonly AUTH_REGISTER = `${this.AUTH}/register`;
  public static readonly AUTH_TOKEN_CHECK = `${this.AUTH}/checkToken`;
  public static readonly AUTH_TOKEN_IS_ADMIN = `${this.AUTH}/checkIfAdmin`;
  public static readonly REFRESH_TOKEN = `${this.AUTH}/refreshToken`;
}
