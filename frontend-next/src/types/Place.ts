import { MongoDBID } from './MongoDBID';
import { User } from './User';

export interface Place {
  _id: MongoDBID;
  name: string;
  location: string;
  users: User[];
}
