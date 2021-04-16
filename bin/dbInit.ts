/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-shadow */
import mongoose from 'mongoose';

import DB_CONFIG from '@config/dbConfig';
import COMMON_UTIL from '@src/utils/commonUtil';

if (!COMMON_UTIL.isProduction) {
  mongoose.set('debug', (collectionName: any, method: any, query: any, doc: any) => {
    console.debug(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });
}
// ! Dev 환경에서 디버깅용

const init = async (): Promise<void> => {
  /* MAIN DB */
  const DB_TARGET = COMMON_UTIL.isProduction
    ? DB_CONFIG.production.main
    : DB_CONFIG.development.main;
  const {
    dbuser, dbpass, host, database,
  } = DB_TARGET;
  const connectUrl = `mongodb+srv://${host}/${database}?retryWrites=true&w=majority`;
  const connectOption: mongoose.ConnectionOptions = {
    auth: {
      user: dbuser,
      password: dbpass,
    },
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    keepAlive: true,
    poolSize: 30,
  };

  function connect() {
    mongoose.connect(connectUrl, connectOption, (err) => {
      if (err) {
        console.warn('MAIN MONGDB connection error', err);
      } else {
        console.debug('MAIN MONGODB connected..');
      }
    });
  }
  connect();
  mongoose.connection.on('disconnected', connect);
  mongoose.connection.on('error', connect);

  /* MAIN DB */
};

export default init;
