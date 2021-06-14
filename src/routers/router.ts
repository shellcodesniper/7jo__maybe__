import Router from 'koa-router';
import { ctxType } from '@src/@types/types';
import userRouter from './users/router';
import parkRouter from './parks/router';

const router = new Router();

router.get('/', async (ctx: ctxType) => {
  if (ctx.session) {
    if (ctx.session.userId || ctx.session.token || ctx.session.username) {
      await ctx.render('index.ejs', { username: ctx.session.username || 'USER' });
      return;
    }
  }
  await ctx.redirect('/user/login');
});

router.use('user', userRouter.routes());

router.use('park', parkRouter.routes());

router.get('ip', (ctx: ctxType) => {
  ctx.body = `${ctx.req.headers['x-forwarded-for'] || ctx.request.ip}`;
});

export default router;
