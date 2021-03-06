import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import serve from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import views from 'koa-views';
import session from 'koa-session';
import { buildRouter } from '@admin-bro/koa';
import indexRouter from '@src/routers/router';

import adminBro from './adminBro';
import KOA_MIDDLEWARE from './middlewares/middleware';

const render = views(path.join(__dirname, '/views'), {
  options: {
    async: true,
  },
  extension: 'ejs',
  map: {
    html: 'ejs',
  },
});

const app:Koa = new Koa();

app.keys = ['klasjdlfjskladfnlkqwejlkFSkdfmklqnrl1@#knflksdnklfvnxDFwoijrjk1klj23'];

app.use(render);

app.use(session({
  key: 'koa.sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: false,
  secure: false,
  sameSite: 'none',
}, app));

const staticDirpath = path.join(__dirname, '..', 'public');
const port: number = parseInt(`${process.env.PORT || '3000'}`, 10);

app.use(KOA_MIDDLEWARE.Cors);
app.use(KOA_MIDDLEWARE.CookieParser);
app.use(KOA_MIDDLEWARE.Compression);
app.use(mount('/static', serve(staticDirpath)));

const parseOption: koaBody.IKoaBodyOptions = {
  patchNode: true,
  formLimit: '10mb',
  multipart: true,
  formidable: { multiples: false },
  onError: (err) => { console.error(err); },
};

const appRouter = new Router();

appRouter.use('/', koaBody(parseOption), indexRouter.routes());

const run = async () => {
  const bro = await adminBro();
  const broRouter = buildRouter(bro, app);

  // broRouter.use('/admin', broRouter.routes());

  app
    .use(appRouter.routes())
    .use(broRouter.routes())
    .use(appRouter.allowedMethods());
  app.listen(port, () => {
    console.log('KuuWang Online.');
  });
};

run();

export default app;
