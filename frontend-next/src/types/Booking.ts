import { MongoDbDate } from './MongoDBDate';
import { MongoDBID } from './MongoDBID';

export interface Booking {
  _id?: MongoDBID;
  endDate?: Date;
  startDate?: Date;
  location: string;
  placeName: string;
  username?: string;
  from?: MongoDbDate;
  to?: MongoDbDate;
  user_color: number;
}
