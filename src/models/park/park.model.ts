import User, { IUser } from '@models/users/user.model';
import mongoose, { Schema, Document } from 'mongoose';

export interface IPark extends Document {
  owner: IUser['_id'];
  name: string;
  location: { lat: number, long: number };
  address: string;
  cost: number;
  description: string;
  inUse: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  _doc: any;
}

const ParkSchema: Schema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: User },
  name: String,
  location: { lat: Number, long: Number }, // ? 위도 경도
  address: String, // ? 자세한 주소
  cost: Number, // ? 가격
  description: String, // ? 설명
  inUse: Boolean,

}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model<IPark>('Park', ParkSchema);
