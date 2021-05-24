import User, { IUser } from '@models/users/user.model';
import ENCRYPT_UTIL from '@utils/encryptUtil';
import { IUserCreate } from './user.service.interface';

namespace USER_SERVICE {
  export async function getUserWithId(userId: IUser['_id']): Promise<IUser | null> {
    const user = await User.findOne({ _id: userId });
    return user;
  }
  export async function findUserWithEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user;
  }

  export async function createUser(user: IUserCreate): Promise<void> {
    const { encryptedPassword, salt } = ENCRYPT_UTIL.Encrypt(user.password);
    const newUser = new User({
      encryptedPassword,
      salt,
      ...user,
    });
    await newUser.save();
  }
}

export default USER_SERVICE;
