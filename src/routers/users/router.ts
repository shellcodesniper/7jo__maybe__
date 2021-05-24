import Router from 'koa-router';
import { ctxType } from '@src/@types/types';
import USER_ROUTER from './index.router';

const router = new Router();

router.get('/login', async (ctx: ctxType) => {
  await ctx.render('login.ejs');
});

router.post('/login', USER_ROUTER.loginAction);

router.get('/join', async (ctx: ctxType) => {
  await ctx.render('join.ejs');
});

router.post('/join', USER_ROUTER.registerAction);

router.get('/logout', USER_ROUTER.logoutAction);

export default router;
