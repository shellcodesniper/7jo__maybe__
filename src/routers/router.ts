import Router from 'koa-router';
import packageData from '@root/package.json';
// import COMMON_UTIL from '@utils/common';
import { ctxType } from '@src/@types/types';

import frontEndRouter from './frontend/router';
// import UserRouter from './users/router';

const router = new Router();

router.all('/', frontEndRouter.routes());

router.get('/', async (ctx: ctxType) => {
  const level: string = (process.env.SERVICE_LEVEL || 'NO LEVEL');
  const { version } = packageData;
  ctx.status = 200;

  const data: Record<string, any> = {
    status: ctx.status,
    msg: "I'm Alive!",
    version,
    level,
  };
  ctx.body = data;
});

router.get('ip', (ctx: ctxType) => {
  ctx.body = `${ctx.req.headers['x-forwarded-for'] || ctx.request.ip}`;
});

export default router;
