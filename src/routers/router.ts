import Router from 'koa-router';
// import COMMON_UTIL from '@utils/common';

import apiRouter from './api/router';
import frontEndRouter from './frontend/router';
// import UserRouter from './users/router';

const router = new Router();

router.use('/', frontEndRouter.routes());
router.use('api', apiRouter.routes());

export default router;
