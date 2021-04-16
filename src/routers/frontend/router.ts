import Router from 'koa-router';

const router = new Router();

router.get('/', (ctx) => {
  ctx.redirect('/static/view/login.html');
});

export default router;
