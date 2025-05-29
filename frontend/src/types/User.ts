import { MongoDBID } from './MongoDBID';

export interface User {
  id?: MongoDBID;
  username: string;
  user_tag: string;
  email: string;
  created_at: string;
}
