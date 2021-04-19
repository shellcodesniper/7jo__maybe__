import pbkdf2 from 'pbkdf2';
import crypto from 'crypto';
import { IEncrypt } from './encryptUtil.interface';

namespace ENCRYPT_UTIL {
  export function Encrypt(password: string): IEncrypt {
    const salt: string = crypto.randomBytes(256).toString('base64');
    const encryptedPassword: string = pbkdf2.pbkdf2Sync(password, salt, 2048, 256, 'sha512').toString('base64');
    return {
      encryptedPassword,
      salt,
    };
  }

  export function Verify(password: string, encryptedPassword: string, salt: string): boolean {
    const result: boolean = (
      pbkdf2.pbkdf2Sync(password, salt, 2048, 256, 'sha512').toString('base64') === encryptedPassword)
      || (pbkdf2.pbkdf2Sync(password, salt, 1024, 256, 'sha512').toString('base64') === encryptedPassword);
    return result;
  }
}

export default ENCRYPT_UTIL;
