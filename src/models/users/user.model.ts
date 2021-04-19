import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  encryptedPassword: string;
  salt: string;
  phoneNumber: string;
  carNumber: string;

  createdAt?: Date;
  updatedAt?: Date;
  _doc: any;
}

const UserSchema: Schema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  encryptedPassword: String,
  salt: String,
  phoneNumber: String,
  carNumber: String,
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model<IUser>('User', UserSchema);
