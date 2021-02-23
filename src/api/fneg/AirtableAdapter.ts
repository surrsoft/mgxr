import { FnegAdapterNT } from './FnegAdapterNT';
import { FnegResult } from './FnegResult';
import { isEmptyOrWhitespaces } from './utils';
import { FnegTableName } from './FnegTableName';
import { FnegRow } from './FnegRow';
import Airtable from 'airtable';
import Record from 'airtable/lib/record';
import { CONF_AIRTABLE_DB_NAME, CONF_AIRTABLE_TABLE_NAME } from '../../consts';
import { FnegCellValue } from './FnegCellValue';
import { FnegColumnName } from './FnegColumnName';

export class AirtableAdapter implements FnegAdapterNT {

  constructor(readonly airtableApiKey: string, readonly dbName: string) {
  }

  init(options: object): FnegResult<unknown> {
    try {
      const dc = Airtable.default_config()
      dc.apiKey = this.airtableApiKey
      dc.endpointUrl = 'https://api.airtable.com'
      Airtable.configure(dc)
    } catch (e) {
      return new FnegResult<unknown>(false, '210222164713', e.message)
    }
    return new FnegResult<unknown>(true)
  }

  tableNameVerify(tableName: string): FnegResult<unknown> {
    // TODO проверки должны быть сложнее
    const success = !isEmptyOrWhitespaces(tableName);
    return new FnegResult(
      success,
      '210220225300',
      `table name ${tableName} is not valid`
    );
  }

  columnNameVerify(columnName: string): FnegResult<unknown> {
    // TODO проверки должны быть сложнее
    return new FnegResult(
      !isEmptyOrWhitespaces(columnName),
      '210220225301',
      `column name ${columnName} is not valid`
    );
  }

  rowCountAllGet(tableName: FnegTableName): FnegResult<number> {
    // TODO temp
    return new FnegResult<number>(true, '', '', 0)
  }

  rowSourceToFnegRow(rowSource: Record): FnegRow {
    const {fields} = rowSource;
    const cellValues: FnegCellValue[] = [];
    for (const [key, value] of Object.entries(fields)) {
      const columnName = new FnegColumnName(this, key);
      const cellValue = new FnegCellValue(columnName, value as string);
      cellValues.push(cellValue);
    }
    const tidCell = new FnegCellValue(new FnegColumnName(this, 'tid'), rowSource.id)
    cellValues.push(tidCell)
    return new FnegRow(cellValues)
  }

  rowsGet(tableName: FnegTableName, maxRecords: number): Promise<FnegRow[]> {
    const _th = this;
    return new Promise((resolve, reject) => {
      const ret: FnegRow[] = [];
      const selectCfg = {};
      if (maxRecords > 0) {
        // @ts-ignore
        selectCfg.maxRecords = maxRecords
      }
      Airtable
        .base(this.dbName)
        .table(tableName.name)
        .select(selectCfg)
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              const row: FnegRow = _th.rowSourceToFnegRow(record)
              ret.push(row)
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error(err);
              reject(err)
            }
            resolve(ret)
          }
        )
    });
  }


}
