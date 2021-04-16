/* eslint-disable global-require */
import dbInit from './dbInit';

// const isProduction = (!((process.env.NODE_ENV || 'development') === 'development'));

process.env.TZ = 'Asia/Seoul';
// ! SET TIMEZONE

dbInit().then(() => {
  require('@src/app');
});
