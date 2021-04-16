declare module 'rsmq-promise' {
  import * as RedisSMQ from 'rsmq';

  declare class RedisSMQPromise {
    constructor(options: any);

    rsmq: RedisSMQ;

    get listQueues(): any;

    get changeMessageVisibility(): any;

    get createQueue(): any;

    get setQueueAttributes(): any;

    get getQueueAttributes(): any;

    get deleteQueue(): any;

    get sendMessage(): any;

    get receiveMessage(): any;

    get deleteMessage(): any;

    get popMessage(): any;

    get quit(): any;
  }

  export = RedisSMQPromise;
}
