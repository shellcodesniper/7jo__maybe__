import { ctxType } from '@src/@types/types';
import PARK_SERVICE from '@services/park/park.service';
import { ICreatePark } from '@services/park/park.service.interface';

namespace indexRouter {
  export async function registerParkAction(ctx: ctxType): Promise<void> {
    const {
      lat, long, address, name, cost, desc,
    } = ctx.req.body;
    if (ctx.session) {
      const parkData: ICreatePark = {
        owner: ctx.session.userId,
        name,
        location: { lat, long },
        address,
        cost,
        description: desc,
        inUse: false,
      };
      await PARK_SERVICE.createPark(parkData);
      await ctx.render('goBackWithMessage', { msg: '등록이 완료되었습니다.' });
      return;
    }
    await ctx.render('goBackWithMessage', { msg: '로그인을 해주시기 바랍니다.' });
  }
}

export default indexRouter;
