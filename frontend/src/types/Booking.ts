import { MongoDbDate } from './MongoDBDate';

export interface Booking {
  endDate?: Date;
  startDate?: Date;
  location: string;
  placeName: string;
  username?: string;
  from?: MongoDbDate;
  to?: MongoDbDate;
}
