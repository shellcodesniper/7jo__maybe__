import { IUser } from '@models/users/user.model';
import mongoose, { Schema, Document } from 'mongoose';

import { IPark } from './park.model';

export interface IReservation extends Document {
  requestUser: IUser['_id'];
  parkTarget: IPark['_id'];
  startTime: string,
  useMin: number,

  createdAt?: Date;
  updatedAt?: Date;
  _doc: any;
}

const ReservationSchema: Schema = new Schema({
  requestUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parkTarget: { type: mongoose.Schema.Types.ObjectId, ref: 'Park' },
  startTime: String,
  useMin: Number,

}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
