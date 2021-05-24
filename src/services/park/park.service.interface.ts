import { IUser } from '@src/models/users/user.model';

export interface ICreatePark {
  owner: IUser['_id'];
  name: string;
  location: { lat: number, long: number };
  address: string;
  cost: number;
  description: string;
  inUse: boolean;
}
