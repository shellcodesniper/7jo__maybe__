import mongoose from 'mongoose';
import { ctxType } from '@src/@types/types';

// import { HTTP_METHOD } from './common.interface';

export * from './common.interface';

namespace COMMON_UTIL {
  export const isProduction = (!((process.env.NODE_ENV || 'development') === 'development'));
  export const isMasterCluster: boolean = (
    (process.env.NODE_APP_INSTANCE === undefined
    || process.env.NODE_APP_INSTANCE === '0'
    || parseInt(process.env.NODE_APP_INSTANCE, 10) === 0)
    && (process.env.SERVICE_LEVEL === 'master' || process.env.SERVICE_LEVEL === undefined)
  );

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  export function isNotNull(data: any): boolean {
    return typeof data !== 'undefined' && data !== null;
  }

  interface IConditionKey {
    conditionOne: string;
    conditionTwo: string;
  }

  export function objectHaveKeys(
    obj: Record<string, string>, keys: string[] = [], conditionKeys: string[][] = [],
  ): [boolean, string[]] {
    const lackKeys: string[] = [];
    const tempConditions: IConditionKey[] = [];
    let success = true;

    for (const condition of conditionKeys) {
      if (condition.length >= 2) {
        tempConditions.push({
          conditionOne: condition[0] as string,
          conditionTwo: condition[1] as string,
        });
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      if (key in obj) {
        if (!COMMON_UTIL.isNotNull(obj[key])) {
          lackKeys.push(key);
          success = false;
        }
      } else {
        lackKeys.push(key);
        success = false;
      }
    }

    for (const condition of tempConditions) {
      if (!(condition.conditionOne in obj || condition.conditionTwo in obj)) {
        lackKeys.push(`<${condition.conditionOne} OR ${condition.conditionTwo}>`);
        success = false;
      }
    }
    return [success, lackKeys];
  }

  export function isJsonString(anyObject: any): boolean {
    try {
      JSON.parse(anyObject);
      return true;
    } catch (e) {
      return false;
    }
  }

  export async function errorResult(ctx: ctxType, msg = '', statusCode = 500): Promise<void> {
    ctx.status = statusCode;
    await ctx.render('goBackWithMessage.ejs', { msg });
  }

  export async function userNotFound(ctx: ctxType): Promise<void> {
    await ctx.render('goBackWithMessage.ejs', { msg: '아이디 혹은 비밀번호를 확인해주시기 바랍니다.' });
  }

  export async function lackKeyResult(ctx: ctxType, lackKeys: string[]): Promise<void> {
    ctx.status = 500;
    await ctx.render('goBackWithMessage.ejs', { msg: `Following Keys must need: ${lackKeys}` })
  }

  export function successResult(ctx: ctxType, data: any = {}, msg = '', statusCode = 200): void {
    ctx.status = statusCode;
    ctx.body = { status: statusCode, msg, data };
  }

  export function convertObjectId(data: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId(data);
  }

  export function convertMongoTimetoKST(time: string | number | Date): Date {
    return new Date(time);
  }

  export function convertPrettyKST(time: string | number | Date, simple?: boolean): string {
    const dateObj = new Date(time);
    const date = (`0${dateObj.getDate()}`).slice(-2);
    const month = (`0${(dateObj.getMonth() + 1)}`).slice(-2);
    const year = dateObj.getFullYear();
    const hour = (`0${dateObj.getHours()}`).slice(-2);
    const minute = (`0${dateObj.getMinutes()}`).slice(-2);
    const second = (`0${dateObj.getSeconds()}`).slice(-2);
    if (simple) {
      return `${year}${month}${date}_${hour}${minute}${second}`;
    }
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  }

  export function sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => { setTimeout(resolve, ms); });
  }

  export function randomGenerator(n: number, c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let r = ''; const cl = c.length; for (let i = 0; i < n; i += 1) { r += c.charAt(Math.floor(Math.random() * cl)); } return r;
  }

  export function randomString(n: number): string {
    return COMMON_UTIL.randomGenerator(n);
  }

  export function randomNumber(n: number): string {
    return COMMON_UTIL.randomGenerator(n, '0123456789');
  }

  export function checkIsPhoneNumber(pn: string): boolean {
    const regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    return regExp.test(pn);
  }

  export function priceLocaleString(price: number): string {
    return `￦ ${price.toLocaleString('ko-KR')}`;
  }

  export function maskingEmail(email: string): string {
    return email.replace(/(?<=.)[^@](?=[^@]*?[^@]@)|(?:(?<=@.)|(?!^)\\G(?=[^@]*$)).(?=.*[^@]\\.)/gi, '*');
  }

  export function maskingName(name: string): string {
    let maskingStr: string = name;
    if (name.length < 3) {
      maskingStr = name.replace(/(?<=.{1})./gi, '*');
    } else {
      maskingStr = name.replace(/(?<=.{2})./gi, '*');
    }
    return maskingStr;
  }

}

export default COMMON_UTIL;
