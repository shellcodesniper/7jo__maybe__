import Router from 'koa-router';
import { ctxType } from '@src/@types/types';
import PARK_SERVICE from '@services/park/park.service';
import { IPark } from '@src/models/park/park.model';
import USER_SERVICE from '@services/user/user.service';
import COMMON_UTIL from '@src/utils/commonUtil';
import PARK_ROUTER from './index.router';

const router = new Router();

router.get('/listPark', async (ctx: ctxType) => {
  const parkList = await PARK_SERVICE.listPark();
  ctx.body = parkList;
});

router.get('/', async (ctx: ctxType) => {
  await ctx.redirect('/');
  // ? 주차장 목록은 메인페이지로 들어가야만 볼 수 있으니까 메인페이지로 들어가도록
});

router.get('/book/:parkId', async (ctx: ctxType) => {
  const { parkId } = ctx.params;
  const park: IPark | null = await PARK_SERVICE.getPark(parkId);
  if (park && ctx.session) {
    if (park.inUse) {
      await ctx.render('goBackWithMessage.ejs', { msg: '이미 사용중인 주차공간입니다!' });
      return;
    }
    const user = await USER_SERVICE.getUserWithId(ctx.session.userId);
    if (user) {
      await ctx.render('park/reservation.ejs', { park, user });
      return;
    }

    await ctx.render('goBackWithMessage.ejs', { msg: '로그인 해주시기 바랍니다.' });
    return;
  }
  await ctx.render('goBackWithMessage.ejs', { msg: '존재하지 않는 주차장을 선택하셨습니다.' });
});

router.post('/book/:parkId', async (ctx: ctxType) => {
  console.log(ctx.req.body);
  const [success, lackKeys] = await COMMON_UTIL.objectHaveKeys(ctx.req.body, ['startTime', 'useMin']);
  if (ctx.session && success) {
    const { parkId } = ctx.params;
    const { useMin, startTime } = ctx.req.body;
    const resultMakeReservation = await PARK_SERVICE.createReservation({
      requestUser: ctx.session.userId,
      targetPark: parkId,
      startTime,
      useMin,
    });
    if (resultMakeReservation) await ctx.render('goToWithMessage.ejs', { msg: '예약이 완료되었습니다.', url: '/' });
    else await ctx.render('goToWithMessage.ejs', { msg: '예약 생성중 오류발생.', url: '/' });
    return;
  }
  if (!success) await ctx.render('goBackWithMessage.ejs', { msg: `${lackKeys} 가 요청 본문에 존재하지 않습니다.`, url: '/' });
  await ctx.render('goToWithMessage.ejs', { msg: '로그인해주시기 바랍니다.', url: '/' });
});

router.get('/list', async (ctx: ctxType) => {
  const parkList = await PARK_SERVICE.listPark();
  if (ctx.session) {
    await ctx.render('park/listPark.ejs', { username: ctx.session.username || 'USER', parkList });
    return;
  }
  await ctx.render('goToWithMessage.ejs', { msg: '로그인해주시기 바랍니다.', url: '/' });
});

router.get('/register', async (ctx: ctxType) => {
  if (ctx.session) {
    await ctx.render('parkRegister.ejs', { username: ctx.session.username || 'USER' });
    return;
  }
  await ctx.render('goToWithMessage.ejs', { msg: '로그인해주시기 바랍니다.', url: '/' });
});

router.post('/register', PARK_ROUTER.registerParkAction);

router.get('/history', async (ctx: ctxType) => {
  if (ctx.session) {
    const reserveList = await PARK_SERVICE.listReservation(ctx.session.userId);
    await ctx.render('park/history.ejs', { username: ctx.session.usename || 'USER', reserveList });
    return;
  }
  await ctx.render('goToWithMessage.ejs', { msg: '로그인해주시기 바랍니다.', url: '/' });
});

export default router;
