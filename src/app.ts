import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import serve from 'koa-static';
import mount from 'koa-mount';
import path from 'path';

import indexRouter from '@src/routers/router';
import KOA_MIDDLEWARE from './middlewares/middleware';

const app:Koa = new Koa();

const staticDirpath = path.join(__dirname, '..', 'public');
const port: number = parseInt(`${process.env.PORT || '3000'}`, 10);

app.use(KOA_MIDDLEWARE.Cors);
app.use(KOA_MIDDLEWARE.CookieParser);
app.use(KOA_MIDDLEWARE.Compression);
app.use(mount('/static', serve(staticDirpath)));

const appRouter = new Router();

const parseOption: koaBody.IKoaBodyOptions = {
  patchNode: true,
  formLimit: '10mb',
  multipart: true,
  formidable: { multiples: false },
  onError: (err) => { console.error(err); },
};

appRouter.use('/', koaBody(parseOption), indexRouter.routes());

app.use(appRouter.routes())
  .use(appRouter.allowedMethods());

app.listen(port, () => {
  console.log('KuuWang Online.');
});

export default app;
