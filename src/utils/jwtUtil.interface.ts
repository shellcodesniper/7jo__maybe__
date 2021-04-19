import { IUser } from '@src/models/users/user.model';

export interface IJwtData {
  _id: IUser['_id'];
  username: IUser['username'];
  user?: IUser | null;
}

export interface IJwtRet {
  success: boolean;
  data?: IJwtData;
  code?: number;
  message?: string;
}
