import { ctxType } from '@src/@types/types';
import COMMON_UTIL from '@utils/commonUtil';

import USER_SERVICE from '@services/user/user.service';
import { IUserCreate } from '@src/services/user/user.service.interface';
import { IUser } from '@models/users/user.model';
import ENCRYPT_UTIL from '@utils/encryptUtil';
import { IJwtData } from '@src/utils/jwtUtil.interface';
import JWT from '@utils/jwtUtil';

namespace USER_ROUTER {
  export async function loginAction(ctx: ctxType): Promise<void> {
    const [success, lackKeys] = COMMON_UTIL.objectHaveKeys(ctx.req.body, ['email', 'password']);
    if (!success) return COMMON_UTIL.lackKeyResult(ctx, lackKeys);

    const { email, password } = ctx.req.body;
    const user: IUser | null = await USER_SERVICE.findUserWithEmail(email);
    if (!user) return COMMON_UTIL.userNotFound(ctx);
    const { encryptedPassword, salt } = user;
    if (ENCRYPT_UTIL.Verify(password, encryptedPassword, salt)) {
      const jwtData: IJwtData = {
        _id: user._id,
        username: user.username,
      };
      const token = JWT.sign(jwtData);
      // ctx.cookies.set('token', token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 * 7 });

      if (ctx.session) {
        ctx.session.token = token;
        ctx.session.userId = jwtData._id;
        ctx.session.username = user.username;
        ctx.session.save();
      }
      return ctx.redirect('/');
      // return COMMON_UTIL.successResult(ctx, { token });
    }
    return COMMON_UTIL.errorResult(ctx, '비밀번호 혹은 이메일을 다시 확인해주시기바랍니다.');
  }

  export async function registerAction(ctx: ctxType): Promise<void> {
    const [success, lackKeys] = COMMON_UTIL.objectHaveKeys(ctx.req.body, ['email', 'password', 'username', 'phoneNumber', 'carNumber']);
    if (!success) return COMMON_UTIL.lackKeyResult(ctx, lackKeys);

    const {
      email, password, username, phoneNumber, carNumber,
    } = ctx.req.body;
    const user: IUserCreate = {
      email,
      password,
      username,
      phoneNumber,
      carNumber,
    };
    await USER_SERVICE.createUser(user);
    // return COMMON_UTIL.successResult(ctx);
    return ctx.redirect('/');
  }

  export async function logoutAction(ctx: ctxType): Promise<void> {
    if (ctx.session) {
      ctx.session = null;
    }
    await ctx.render('gotoWithMessage.ejs', { msg: '로그아웃 완료되었습니다.', url: '/' });
  }
}

export default USER_ROUTER;
