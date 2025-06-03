import { MongoDBID } from './MongoDBID';

export interface User {
  _id: MongoDBID;
  username: string;
  user_tag: string;
  email: string;
  created_at: string;
  color: number;
}
