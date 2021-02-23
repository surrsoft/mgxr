import { FnegResult } from './FnegResult';
import { FnegTableName } from './FnegTableName';
import { FnegRow } from './FnegRow';

export interface FnegAdapterNT {
  /**
   * {ru} одноразовая инициализация
   * @param options
   */
  init(options: object): FnegResult<unknown>

  /**
   *
   * @param tableName
   */
  tableNameVerify(tableName: string): FnegResult<unknown>

  columnNameVerify(columnName: string): FnegResult<unknown>

  /**
   * {ru} возвращает сколько в *таблице всего *рядов
   */
  rowCountAllGet(tableName: FnegTableName): FnegResult<number>

  rowsGet(tableName: FnegTableName, maxRecords: number): Promise<FnegRow[]>

  rowSourceToFnegRow(rowSource: any): FnegRow

}
