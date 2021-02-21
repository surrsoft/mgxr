import { FnegResult } from './FnegResult';

export interface FnegTableNameVeriferNT {
  verify(tableName: string): FnegResult
}
