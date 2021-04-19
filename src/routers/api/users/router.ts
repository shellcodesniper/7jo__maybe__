import Router from 'koa-router';
import USER_ROUTER from './index.router';

const router = new Router();

router.post('/', USER_ROUTER.loginAction);
router.post('/register', USER_ROUTER.registerAction);

export default router;
