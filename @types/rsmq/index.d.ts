declare module 'rsmq' {
  import redis = require('redis');

  export interface ClientOptions {
      host?: string;
      port?: number;
      password?: string;
      options?: redis.ClientOpts;
      client?: redis.RedisClient;
      ns?: string;
      db?: number;
  }

  declare var RedisSMQ: RedisSMQStatic;

  export = RedisSMQ;
}
