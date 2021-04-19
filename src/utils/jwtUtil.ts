import jwt from 'jsonwebtoken';
import { IJwtData, IJwtRet } from './jwtUtil.interface';

export * from './jwtUtil.interface';

const jwtSecret: jwt.Secret = '9SvceMlLRnnz4ZSMeGYMYAGO38XXBfRe6Lt96Y8YWc4V6DpsMDQ1uESrjA7St6ExNmmyK8zYDpIu1N6S66jYaiKxGsW3eq5pi1wT7v9294eEey3JX2y1oBzaw9Ez1o0KUqRQemdaT7enNaI9i5huFE0Oum55m9ZFeAK7woCmmQRgF7RyrcdNt7Ytly99qhc7vUFmyFIoHqfapQklInIZYiep4EQJ7myQn8fSSdoAygzGifdcKsnUPlNgdRzopgh6Ip1d1uPhulM56m1GA19lZqd3k0OpflPkRAd140g29dohCrOhFhteZWeHZL4efi70bgfaMg1ViLSkvviQlq6Dtx0xorTU1EOkPYSMl2PTsrjwY0tymCMVZ64LbyetFlEzFS2iOuh6VRFzSu21mi2FIN3pfl70UmX8NUWtSVypNFydDeOr7ujNxbXUYcmz616hToSAGqpBM8vwvjhHjqFfuJZtLAShLvv9N9jZnaA93bdWFlCJKIBvGYZsglJCenDx';
const signOption: jwt.SignOptions = {
  algorithm: 'HS512',
  expiresIn: '7d',
  issuer: 'capstone.kuuwang.com',
};

namespace JWT {

  export const errorTable: { [id:string]: string} = {
    '-2': 'String returned..', // Object를 반환하도록 생각하였는데 string이 리턴됨
    '-1': 'Unknown', // 모르는 에러
    0: 'TokenExpired', // 토큰 만료됨
    1: 'JsonWebTokenError', // webtoken Error 통틀어서
    2: 'NotBeforeError', // Json 아직 active 되지 않음.
  };

  export function sign(data: IJwtData): string {
    return jwt.sign(data, jwtSecret, signOption);
  }

  export function verify(token: string): IJwtRet {
    try {
      const data: string | Record<string, any> = jwt.verify(token, jwtSecret);
      if (typeof data === 'string') {
        return { success: false, code: -2, message: data } as IJwtRet;
      }

      return { success: true, data: (data as IJwtData) };
    } catch (err: any) {
      let code = -1;
      let message = '';
      if (err instanceof jwt.TokenExpiredError) code = 0;
      else if (err instanceof jwt.JsonWebTokenError) code = 1;
      else if (err instanceof jwt.NotBeforeError) code = 2;

      if (err.message) message = err.message;

      return { success: false, code, message } as IJwtRet;
    }
  }

  export function decode(token: string): string | { [key: string]: any; } | null {
    return jwt.decode(token, { complete: true });
  }
}

export default JWT;
