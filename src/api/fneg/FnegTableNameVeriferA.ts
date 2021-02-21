import { FnegTableNameVeriferNT } from './FnegTableNameVeriferNT';
import { FnegResult } from './FnegResult';
import { isEmptyOrWhitespaces } from './utils';

export class FnegTableNameVeriferA implements FnegTableNameVeriferNT {
  verify(tableName: string): FnegResult {
    // TODO проверки должны быть сложнее
    return new FnegResult(isEmptyOrWhitespaces(tableName), '210220225300', `#FnegTableNameVeriferA# table name ${tableName} is not valid`);
  }
}
