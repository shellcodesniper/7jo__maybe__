/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-shadow */
import mongoose from 'mongoose';
import { ImongoParsedError } from './databaseUtil.interface';

export * from './databaseUtil.interface';

namespace DB_UTIL {
  // ! validDoc 오류별로 정리해둠.
  export const mongoErrDict: { [id: string]: string} = {
    '-1': 'unknown Error',
    0: 'success',
    1: 'castError',
    2: 'array projection and then modified the array in an unsafe way',
    3: 'Document Not Found',
    4: 'models are not Registered Yet,',
    5: 'Model with Given Name Already Registered!!',
    6: 'save Called Multiple Time On Same Document!!',
    7: 'model is on struct mode.. must have no changes on immutable properties',
    8: 'validation Error Check errors param',
    9: 'validator Errors Check erros param',
  };

  export function mongoErrorParser(err: mongoose.Error | any): ImongoParsedError {
    let retCode = 0;
    if (err) {
      if (err instanceof mongoose.Error) {
        retCode = -1;
        if (err instanceof mongoose.Error.CastError) retCode = 1;
        else if (err instanceof mongoose.Error.DivergentArrayError) retCode = 2;
        else if (err instanceof mongoose.Error.DocumentNotFoundError) retCode = 3;
        else if (err instanceof mongoose.Error.MissingSchemaError) retCode = 4;
        else if (err instanceof mongoose.Error.OverwriteModelError) retCode = 5;
        else if (err instanceof mongoose.Error.ParallelSaveError) retCode = 6;
        // else if (err instanceof mongoose.Error.StrictMode) retCode = 7;
        // ? StrictMode Disabled Currently
        else if (err instanceof mongoose.Error.ValidationError) retCode = 8;
        else if (err instanceof mongoose.Error.ValidatorError) retCode = 9;
      }
    }
    const retDict: ImongoParsedError = {
      code: retCode,
      err: retCode !== 0
        ? err
        : undefined,
      errors: retCode !== 0
        ? err.errors
        : undefined,
      resolvedMessage: retCode !== 0
        ? mongoErrDict[retCode.toString()]
        : undefined,
      message: retCode !== 0
        ? (err as mongoose.Error).message
        : undefined,
    };
    return retDict;
  }

  export interface IValidateDocRet {
    success: boolean;
    error?: ImongoParsedError
  }
  export function validateDoc<T extends mongoose.Document>(instance: T): IValidateDocRet {
    const err = instance.validateSync();

    if (err) {
      const retDict: IValidateDocRet = { success: false, error: mongoErrorParser(err) };
      return retDict;
    }
    const retDict: IValidateDocRet = { success: true };
    return retDict;
  }

  export function getDefault():mongoose.Connection { return mongoose.connection; }
}

export default DB_UTIL;
