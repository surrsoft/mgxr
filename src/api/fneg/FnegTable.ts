import { FnegTableName } from './FnegTableName';
import { FnegAdapterNT } from './FnegAdapterNT';
import { FnegResult } from './FnegResult';
import { FnegRow } from './FnegRow';

export class FnegTable {
  constructor(readonly adapter: FnegAdapterNT, readonly tableName: FnegTableName) {

  }

  rowCountAllGet(): FnegResult<number> {
    return this.adapter.rowCountAllGet(this.tableName)
  }

  async rowsGet(maxRecords: number = 0): Promise<FnegRow[]> {
    return this.adapter.rowsGet(this.tableName, maxRecords);
  }
}
