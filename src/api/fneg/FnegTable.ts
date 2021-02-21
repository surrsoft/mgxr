import { FnegTableName } from './FnegTableName';
import { FnegAdapterNT } from './FnegAdapterNT';

export class FnegTable {
  constructor(readonly context: FnegAdapterNT, readonly tableName: FnegTableName) {

  }
}
