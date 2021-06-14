import AdminBro from 'admin-bro';
import AdminBroMongoose from '@admin-bro/mongoose';
import mongoose from 'mongoose';
import DB_CONFIG from '@config/dbConfig';
import COMMON_UTIL from './utils/commonUtil';

AdminBro.registerAdapter(AdminBroMongoose);

export default async (): Promise<AdminBro> => {
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

  const mongooseDb = await mongoose.connect(connectUrl, connectOption);

  const adminBro = new AdminBro({
    databases: [mongooseDb],
    rootPath: '/bro',
    branding: {
      companyName: '7 JO',
    },
    dashboard: {
      handler: async () => { console.log ('im handler'); },
      component: AdminBro.bundle('./broDashboard.jsx'),
    },
  });

  return adminBro;
};
